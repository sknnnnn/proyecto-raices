/* =========================================================
   DATA API — PROYECTO RAÍCES
   ---------------------------------------------------------
   Única capa que consulta Supabase. Ningún otro archivo debe
   importar el cliente de Supabase directamente ni conocer
   nombres de tabla/columna: todo pasa por las funciones de
   este archivo, que devuelven objetos ya mapeados a los
   nombres que usa el resto del sitio (camelCase).

   Las relaciones se mantienen separadas (no se aplana todo en
   un único objeto plano al estilo PROPUESTAS):
     experiencia
       ├── destino        (objeto embebido, o null)
       ├── actividades[]  (array de {id, slug, nombre})
       ├── galeria[]      (sólo vía getGaleria, bajo demanda)
       └── paquete: experiencias incluidas, sólo vía
           getExperienciasDeUnPaquete, bajo demanda.

   Estrategia anti N+1: las grillas de experiencias y destinos
   se resuelven con una sola consulta cada una (usando el
   embedding de Supabase para traer destino + actividades en el
   mismo request), y la disponibilidad comercial de un destino
   se calcula en memoria contra un único listado de experiencias
   publicadas — nunca una consulta por destino.
   ========================================================= */

const DataAPI = (() => {

  function client() {
    if (!supabaseClient) {
      throw new Error("Supabase no está inicializado (falta el SDK o supabase-client.js).");
    }
    return supabaseClient;
  }

  /* ---------- Mapeo de filas de Supabase a los shapes del sitio ---------- */

  function mapDestino(d, cantidadExperiencias) {
    if (!d) return null;
    const esPlaceholder = !!d.es_placeholder;
    return {
      id: d.id,
      slug: d.slug,
      nombre: d.nombre,
      pais: d.pais,
      region: d.region || null,
      grupo: d.grupo,
      imagen: d.imagen || null,
      imagenPos: d.imagen_pos || null,
      resumen: d.resumen || "",
      esPlaceholder,
      orden: d.orden,
      cantidadExperiencias: cantidadExperiencias || 0,
      // Mismo criterio que destinoDisponibleComercialmente() en el sitio
      // estático: un destino sin esPlaceholder siempre está disponible;
      // uno con esPlaceholder:true (ficha propia mínima) también cuenta
      // como disponible si ya tiene alguna experiencia publicada+activa
      // (caso Choquequirao).
      disponible: !esPlaceholder || (cantidadExperiencias || 0) > 0
    };
  }

  function mapActividad(a) {
    if (!a) return null;
    return { id: a.id, slug: a.slug, nombre: a.nombre };
  }

  function mapExperiencia(e, destinosPorId) {
    const destinoRow = e.destino || (destinosPorId ? destinosPorId[e.destino_id] : null);
    const actividades = (e.experiencia_actividades || [])
      .map(rel => mapActividad(rel.actividades))
      .filter(Boolean);
    return {
      id: e.id,
      slug: e.slug,
      nombre: e.nombre,
      tipoProducto: e.tipo_producto,
      destinoId: e.destino_id,
      destino: destinoRow ? mapDestino(destinoRow, destinoRow.cantidadExperiencias) : null,
      actividades,
      resumen: e.resumen || "",
      descripcion: e.descripcion || "",
      duracion: e.duracion || "",
      modalidad: e.modalidad || "",
      ubicacion: e.ubicacion || "",
      precio: e.precio,
      publicado: !!e.publicado,
      esPlaceholder: !!e.es_placeholder,
      destacada: !!e.destacada,
      imagen: e.imagen || null,
      imagenPos: e.imagen_pos || null,
      orden: e.orden,
      incluye: e.incluye || [],
      noIncluye: e.no_incluye || [],
      infoImportante: e.info_importante || null,
      detalle: e.detalle || {}
    };
  }

  /* ---------- Selects reutilizados (embedding = anti N+1) ---------- */

  const EXPERIENCIA_SELECT = `
    *,
    destino:destinos!experiencias_destino_fk(*),
    experiencia_actividades(actividades(*))
  `;

  /* ---------- Caché en memoria (dura sólo la vida de la página) ----------
     Evita repetir la misma consulta cuando varias secciones de una misma
     página piden lo mismo (p.ej. destinos activos pedidos por el selector
     de Contacto y por el explorador de país/destino). No es una fuente de
     datos paralela: sigue siendo el mismo resultado de Supabase, sólo que
     no se vuelve a pedir por red dentro de la misma carga de página. */
  const cache = {};
  function memoize(key, fn) {
    if (!cache[key]) cache[key] = fn();
    return cache[key];
  }

  /* ================= DESTINOS ================= */

  // Todos los destinos activos, con su disponibilidad comercial ya resuelta
  // en memoria (una consulta a destinos + una consulta liviana de conteo de
  // experiencias por destino_id — nunca una consulta por destino individual).
  async function getDestinosActivos() {
    return memoize("destinosActivos", async () => {
      const sb = client();
      const [destinosRes, expsRes] = await Promise.all([
        sb.from("destinos").select("*").eq("activo", true).order("orden", { ascending: true }),
        sb.from("experiencias").select("destino_id").eq("publicado", true).eq("activo", true)
      ]);
      if (destinosRes.error) throw destinosRes.error;
      if (expsRes.error) throw expsRes.error;

      const conteo = {};
      (expsRes.data || []).forEach(row => {
        conteo[row.destino_id] = (conteo[row.destino_id] || 0) + 1;
      });
      return (destinosRes.data || []).map(d => mapDestino(d, conteo[d.id] || 0));
    });
  }

  async function getDestinoPorSlug(slug) {
    if (!slug) return null;
    const destinos = await getDestinosActivos();
    return destinos.find(d => d.slug === slug) || null;
  }

  /* ================= ACTIVIDADES ================= */

  async function getActividades() {
    return memoize("actividades", async () => {
      const sb = client();
      const { data, error } = await sb.from("actividades").select("*").eq("activo", true).order("orden", { ascending: true });
      if (error) throw error;
      return (data || []).map(mapActividad);
    });
  }

  /* ================= EXPERIENCIAS ================= */

  // Único punto de entrada para listados públicos: siempre publicado+activo.
  // Filtros opcionales por tipo/destino/actividad se aplican en memoria
  // sobre el mismo resultado (41 filas totales: no amerita ida y vuelta
  // al servidor por cada combinación de filtro).
  async function getExperienciasPublicadas({ tipo, destinoSlug, actividadSlug } = {}) {
    const lista = await memoize("experienciasPublicadas", async () => {
      const sb = client();
      const { data, error } = await sb
        .from("experiencias")
        .select(EXPERIENCIA_SELECT)
        .eq("publicado", true)
        .eq("activo", true)
        .order("orden", { ascending: true });
      if (error) throw error;
      return (data || []).map(e => mapExperiencia(e));
    });

    return lista.filter(p => {
      if (tipo && p.tipoProducto !== tipo) return false;
      if (destinoSlug && (!p.destino || p.destino.slug !== destinoSlug)) return false;
      if (actividadSlug && !p.actividades.some(a => a.slug === actividadSlug)) return false;
      return true;
    });
  }

  async function getExperienciaPorSlug(slug) {
    if (!slug) return null;
    const sb = client();
    const { data, error } = await sb
      .from("experiencias")
      .select(EXPERIENCIA_SELECT)
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return mapExperiencia(data);
  }

  async function getExperienciasPorDestino(destinoSlug) {
    return getExperienciasPublicadas({ destinoSlug });
  }

  // Galería completa de una experiencia (bajo demanda: sólo la ficha de
  // detalle la necesita, la grilla usa únicamente "imagen"/"imagenPos").
  async function getGaleria(experienciaId) {
    if (!experienciaId) return [];
    const sb = client();
    const { data, error } = await sb
      .from("experiencia_imagenes")
      .select("url, orden, foco, alt")
      .eq("experiencia_id", experienciaId)
      .order("orden", { ascending: true });
    if (error) throw error;
    return data || [];
  }

  // Experiencias (tours/travesías) incluidas en un paquete, resueltas por
  // paquete_experiencias, ya filtradas a publicado+activo y ordenadas.
  // Hoy no hay ningún paquete con relaciones cargadas (el único paquete,
  // "andes-peru-ejemplo", no está publicado) — la función queda lista para
  // cuando exista un caso real, sin datos inventados mientras tanto.
  async function getExperienciasDeUnPaquete(paqueteId) {
    if (!paqueteId) return [];
    const sb = client();
    const { data, error } = await sb
      .from("paquete_experiencias")
      .select(`orden, experiencia:experiencias!paquete_experiencias_experiencia_fk(${EXPERIENCIA_SELECT})`)
      .eq("paquete_id", paqueteId)
      .order("orden", { ascending: true });
    if (error) throw error;
    return (data || [])
      .map(row => ({ orden: row.orden, experiencia: row.experiencia ? mapExperiencia(row.experiencia) : null }))
      .filter(row => row.experiencia && row.experiencia.publicado);
  }

  /* ================= EQUIPO ================= */

  async function getEquipoActivo() {
    return memoize("equipoActivo", async () => {
      const sb = client();
      const { data, error } = await sb.from("equipo").select("*").eq("activo", true).order("orden", { ascending: true });
      if (error) throw error;
      return (data || []).map(m => ({
        id: m.id,
        nombre: m.nombre,
        rol: m.rol || null,
        descripcion: m.descripcion || null,
        imagen: m.imagen || null,
        imagenPos: m.imagen_pos || null,
        orden: m.orden
      }));
    });
  }

  /* ================= SITE CONFIG ================= */

  // Devuelve un objeto clave→valor con el mismo shape que usaba
  // SITE_CONFIG (nombre, dominio, email, whatsapp, instagram,
  // instagramUrl, tiktok, tiktokUrl, horarios[], ubicacionBase,
  // nosotrosTexto, fraseHero) — "horarios" llega como JSON y se
  // parsea acá una sola vez.
  async function getSiteConfig() {
    return memoize("siteConfig", async () => {
      const sb = client();
      const { data, error } = await sb.from("site_config").select("clave, valor").eq("activo", true);
      if (error) throw error;
      const camel = {
        nombre: "nombre", dominio: "dominio", email: "email", whatsapp: "whatsapp",
        instagram: "instagram", instagram_url: "instagramUrl", tiktok: "tiktok",
        tiktok_url: "tiktokUrl", ubicacion_base: "ubicacionBase",
        nosotros_texto: "nosotrosTexto", frase_hero: "fraseHero", horarios: "horarios"
      };
      const config = {};
      (data || []).forEach(row => {
        const key = camel[row.clave] || row.clave;
        config[key] = row.valor;
      });
      if (typeof config.horarios === "string") {
        try { config.horarios = JSON.parse(config.horarios); } catch (e) { config.horarios = []; }
      }
      return config;
    });
  }

  return {
    getDestinosActivos,
    getDestinoPorSlug,
    getActividades,
    getExperienciasPublicadas,
    getExperienciaPorSlug,
    getExperienciasPorDestino,
    getGaleria,
    getExperienciasDeUnPaquete,
    getEquipoActivo,
    getSiteConfig
  };
})();
