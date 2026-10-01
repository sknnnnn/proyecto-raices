/* =========================================================
   PROYECTO RAÍCES — main.js
   Lógica compartida por todas las páginas: menú mobile,
   año del footer, botón de WhatsApp, formulario de contacto,
   lightbox de galería, y el armado dinámico de las páginas
   que se alimentan de Supabase vía assets/js/data-api.js
   (destinos, experiencias, actividades, galería, equipo,
   site_config — ver ese archivo para el detalle de cada
   consulta).

   NAVEGACIÓN POR DOS EJES (conviven sobre la misma data):
   - Por tipo: tours.html / travesias.html / paquetes.html
     cada una fija su tipo vía body[data-tipo-fijo].
   - Por destino: destinos.html → destino.html?destino=slug (ficha
     editorial) → experiencias.html?destino=slug (catálogo principal,
     sin tipo fijo: mezcla tours, travesías y paquetes, con chips de
     tipo + selector de destino). catalogo.html es sólo una redirección
     a experiencias.html, conservada por los enlaces antiguos.

   Cada función de render sólo actúa si encuentra en la página
   el contenedor que le corresponde, así este único archivo
   sirve para todo el sitio.
   ========================================================= */

/* Configuración del sitio (antes SITE_CONFIG de site-config.js), ahora
   poblada desde Supabase (tabla site_config) vía DataAPI. La consulta
   arranca apenas carga este script (no espera a DOMContentLoaded), y
   "siteConfigReady" es la promesa que cualquier script de página debe
   esperar antes de llamar whatsappLink() o leer
   SITE_CONFIG — evita la carrera entre el fetch async y un script
   inline de página que quiera usarlo de entrada (ver contacto.html,
   index.html). */
let SITE_CONFIG = {};
const siteConfigReady = (typeof DataAPI !== "undefined")
  ? DataAPI.getSiteConfig().then(cfg => { SITE_CONFIG = cfg; return cfg; }).catch(err => {
      console.error("Error cargando la configuración del sitio:", err);
      return SITE_CONFIG;
    })
  : Promise.resolve(SITE_CONFIG);
window.siteConfigReady = siteConfigReady;

// Arma el link de WhatsApp con mensaje precargado (si hay número cargado).
function whatsappLink(mensaje){
  if (!SITE_CONFIG.whatsapp) return null;
  const texto = encodeURIComponent(mensaje || I18N.t("whatsapp.mensajeDefault"));
  return `https://wa.me/${SITE_CONFIG.whatsapp}?text=${texto}`;
}

document.addEventListener("DOMContentLoaded", async () => {
  initNav();
  initHeaderScroll();
  initFooterYear();
  initLightbox();

  await siteConfigReady;
  initWhatsappFloat();
  initContactForm();
  initFotosForm();
  initFooterContacto();

  renderPropuestasGrid();   // async — consulta Supabase vía DataAPI
  renderPropuestaDetalle(); // async — consulta Supabase vía DataAPI
  renderDestinoEditorial(); // async — sólo actúa si la página tiene #destino-editorial (destino.html, PRO-34)
  renderCalendarioSalidas(); // sólo actúa si la página tiene #calendario-grid (calendario.html)
  renderEquipoGrid(); // async — sólo actúa si la página tiene #equipo-grid o #equipo-mini-grid
  initTestimoniosCarousel(); // sólo actúa si la página tiene #testi-track (Inicio)
  initComentariosGrid(); // sólo actúa si la página tiene #comentarios-grid (comentarios.html)
  initGaleriaJustify(); // sólo actúa si la página tiene .gal-row (galeria.html)
});

/* Metadata de presentación por tipo de producto (label/plural/página de
   listado). No es un dato de negocio de una experiencia puntual — es
   configuración de UI fija, así que vive acá en vez de en Supabase.
   "tipoProducto" en Supabase es la fuente de verdad de qué tipo es cada
   experiencia; esto sólo mapea ese valor a texto. */
const TIPOS_PROPUESTA = {
  tour:     { label: I18N.t("tipo.tour.label"),     labelPlural: I18N.t("tipo.tour.labelPlural"),     pagina: "tours.html" },
  travesia: { label: I18N.t("tipo.travesia.label"), labelPlural: I18N.t("tipo.travesia.labelPlural"), pagina: "travesias.html" },
  paquete:  { label: I18N.t("tipo.paquete.label"),  labelPlural: I18N.t("tipo.paquete.labelPlural"),  pagina: "paquetes.html" }
};

/* ---------- Header sólido al scrollear ----------
   En Inicio/Comentarios el header nace transparente sobre la
   foto de portada (ver style.css); esta clase lo pasa a sólido apenas
   se scrollea, sin afectar el resto de las páginas (ahí ya es sólido
   siempre por CSS y la clase no cambia nada visualmente). */
function initHeaderScroll(){
  const header = document.querySelector("header");
  if (!header) return;
  const marcar = () => header.classList.toggle("is-solid", window.scrollY > 30);
  marcar();
  window.addEventListener("scroll", marcar, { passive: true });
}

/* Mezcla una lista de propuestas por tipo (round-robin), preservando el
   orden real dentro de cada tipo — así Tours/Travesías/Paquetes quedan
   intercalados (Tour, Travesía, Tour, Paquete…) en vez de agrupados en
   bloques, sin alterar los datos ni su orden de origen. Reutilizable
   por cualquier vista que junte más de un tipo en una misma lista. */
function interleaveByTipo(lista){
  const grupos = {};
  const orden = [];
  lista.forEach(p => {
    const tipo = p.tipoProducto;
    if (!grupos[tipo]) { grupos[tipo] = []; orden.push(tipo); }
    grupos[tipo].push(p);
  });
  const resultado = [];
  let quedan = true;
  while (quedan) {
    quedan = false;
    orden.forEach(tipo => {
      if (grupos[tipo].length) {
        resultado.push(grupos[tipo].shift());
        quedan = true;
      }
    });
  }
  return resultado;
}

/* Scroll horizontal con easing propio (en vez del scrollBy nativo,
   cuyo "smooth" es un poco mecánico) — usado por las flechas de los
   carruseles para que el recorrido se sienta más chill. Respeta
   prefers-reduced-motion saltando directo al destino.

   scrollSuaveRAF guarda, por elemento, el requestAnimationFrame de la
   animación en curso (si la hay). Sin esto, dos llamadas seguidas antes
   de que la primera termine (doble click, clicks rápidos) dejaban dos
   rAF escribiendo el mismo scrollLeft a la vez — eso es lo que se veía
   como un pequeño movimiento previo al desplazamiento "real". Cancelar
   la animación anterior de ESE elemento antes de arrancar una nueva
   resuelve el problema para cualquier consumidor de scrollSuave, sin
   cambiar la firma ni el comportamiento de una llamada aislada. */
const scrollSuaveRAF = new WeakMap();
function scrollSuave(el, delta, duracion){
  const rafAnterior = scrollSuaveRAF.get(el);
  if (rafAnterior) { cancelAnimationFrame(rafAnterior); scrollSuaveRAF.delete(el); }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const inicio = el.scrollLeft;
  const max = el.scrollWidth - el.clientWidth;
  const destino = Math.max(0, Math.min(max, inicio + delta));
  if (reduceMotion) { el.scrollLeft = destino; return; }
  const distancia = destino - inicio;
  const t0 = performance.now();
  const dur = duracion || 550;
  function easeInOutQuad(t){ return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function paso(ahora){
    const t = Math.min(1, (ahora - t0) / dur);
    el.scrollLeft = inicio + distancia * easeInOutQuad(t);
    if (t < 1) {
      scrollSuaveRAF.set(el, requestAnimationFrame(paso));
    } else {
      scrollSuaveRAF.delete(el);
    }
  }
  scrollSuaveRAF.set(el, requestAnimationFrame(paso));
}

/* ---------- Navegación mobile + link activo ---------- */
function initNav(){
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".navlinks");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Marca el link activo según data-page en <body>. Las páginas que
  // pertenecen a otra sección del menú (Tours/Travesías/Paquetes y la
  // ficha de una experiencia → Experiencias) lo indican con
  // data-nav-active, sin tocar data-page (que también usa el CSS).
  const page = document.body.getAttribute("data-nav-active") || document.body.getAttribute("data-page");
  if (page) {
    document.querySelectorAll(`.navlinks a[data-nav="${page}"]`).forEach(a => {
      a.classList.add("active");
    });
  }
}

function initFooterYear(){
  const el = document.getElementById("footer-year");
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------- Redes/contacto del footer ----------
   #footer-instagram / #footer-tiktok / #footer-email están presentes en
   el footer de todas las páginas. Se completan acá con SITE_CONFIG (ya
   cargado por siteConfigReady antes de llamar esta función — no dispara
   ninguna consulta nueva). Si algún valor no está disponible, el link
   queda con href="#" en vez de mostrar un dato viejo/inventado. */
function initFooterContacto(){
  const igEl = document.getElementById("footer-instagram");
  if (igEl && SITE_CONFIG.instagramUrl) igEl.href = SITE_CONFIG.instagramUrl;

  const ttEl = document.getElementById("footer-tiktok");
  if (ttEl && SITE_CONFIG.tiktokUrl) ttEl.href = SITE_CONFIG.tiktokUrl;

  const emailEl = document.getElementById("footer-email");
  if (emailEl && SITE_CONFIG.email) emailEl.href = `mailto:${SITE_CONFIG.email}`;
}

/* ---------- Botón flotante de WhatsApp ---------- */
function initWhatsappFloat(){
  const holder = document.getElementById("whatsapp-float-holder");
  if (!holder) return;
  const link = whatsappLink();
  if (!link) return; // sin número cargado todavía: no se muestra nada
  holder.innerHTML = `<a class="whatsapp-float" href="${link}" target="_blank" rel="noopener" aria-label="${I18N.t("aria.escribinosWhatsapp")}">💬</a>`;
}

/* ---------- Formulario de contacto ----------
   Envío real vía Supabase Edge Function ("contact-form"), que reenvía
   el mensaje por Resend a SITE_CONFIG.email con el email del visitante
   como reply-to. Ver supabase/functions/contact-form/index.ts. */
function setFormStatus(status, text, kind){
  if (!status) return;
  status.textContent = text;
  status.classList.remove("ok", "err");
  status.classList.add("show", kind);
}

function initContactForm(){
  const form = document.getElementById("contact-form");
  if (!form) return;
  const status = document.getElementById("form-status");
  const submitBtn = form.querySelector("button[type=submit]");
  let sending = false;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (sending) return;

    const nombre = form.nombre.value.trim();
    const email = form.email.value.trim();
    const destino = form.destino.value;
    const mensaje = form.mensaje.value.trim();

    if (!nombre || !email || !mensaje) {
      setFormStatus(status, I18N.t("contacto.form.errorCampos"), "err");
      return;
    }

    sending = true;
    if (submitBtn) submitBtn.disabled = true;
    setFormStatus(status, I18N.t("contacto.form.enviando"), "ok");

    try {
      await DataAPI.enviarContacto({ nombre, email, destino, mensaje });
      setFormStatus(status, I18N.t("contacto.form.exito"), "ok");
      form.reset();
    } catch (err) {
      console.error("Error enviando el formulario de contacto:", err);
      setFormStatus(status, I18N.t("contacto.form.error"), "err");
    } finally {
      sending = false;
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

/* ---------- "Enviá tus fotos" (galería) ----------
   Flujo real: el navegador sube las fotos directo al bucket privado de
   Storage "envios-fotos" (sólo permite insert, ver policy en Supabase),
   agrupadas bajo una carpeta con un UUID por envío. Recién después se
   llama a la Edge Function "submit-photos", que verifica qué archivos
   existen de verdad para ese UUID, genera links firmados temporales y
   dispara el email por Resend. Ver supabase/functions/submit-photos/. */
const FOTOS_TIPOS_VALIDOS = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const FOTOS_MAX_SIZE = 8 * 1024 * 1024; // 8MB por foto (mismo límite que el bucket)
const FOTOS_MAX_CANTIDAD = 8;

function initFotosForm(){
  const toggle = document.getElementById("fotos-toggle");
  const panel = document.getElementById("fotos-form");
  if (!toggle || !panel) return;

  toggle.addEventListener("click", () => {
    const abierto = !panel.hidden;
    panel.hidden = abierto;
    toggle.setAttribute("aria-expanded", String(!abierto));
  });

  const fileInput = document.getElementById("fotos-input");
  const fileList = document.getElementById("fotos-seleccionadas");
  fileInput?.addEventListener("change", () => {
    const files = Array.from(fileInput.files || []);
    if (!fileList) return;
    fileList.innerHTML = "";
    files.forEach(f => {
      const li = document.createElement("li");
      li.textContent = f.name;
      li.title = f.name;
      fileList.appendChild(li);
    });
  });

  const form = document.getElementById("fotos-form");
  const status = document.getElementById("fotos-status");
  const submitBtn = form.querySelector("button[type=submit]");
  let sending = false;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (sending) return;

    const nombre = form.nombre.value.trim();
    const email = form.email.value.trim();
    const mensaje = form.mensaje.value.trim();
    const files = Array.from(fileInput?.files || []);

    if (!nombre || !email) {
      setFormStatus(status, I18N.t("galeria.fotosForm.errorCampos"), "err");
      return;
    }
    if (!files.length) {
      setFormStatus(status, I18N.t("galeria.fotosForm.errorSinFotos"), "err");
      return;
    }
    if (files.length > FOTOS_MAX_CANTIDAD) {
      setFormStatus(status, I18N.t("galeria.fotosForm.errorMaxCantidad", { max: FOTOS_MAX_CANTIDAD }), "err");
      return;
    }
    const invalido = files.find(f => !FOTOS_TIPOS_VALIDOS.includes(f.type));
    if (invalido) {
      setFormStatus(status, I18N.t("galeria.fotosForm.errorFormato", { nombre: invalido.name }), "err");
      return;
    }
    const pesado = files.find(f => f.size > FOTOS_MAX_SIZE);
    if (pesado) {
      setFormStatus(status, I18N.t("galeria.fotosForm.errorPeso", { nombre: pesado.name }), "err");
      return;
    }

    sending = true;
    if (submitBtn) submitBtn.disabled = true;
    setFormStatus(status, I18N.t("galeria.fotosForm.subiendo"), "ok");

    try {
      const submissionId = crypto.randomUUID();
      for (const file of files) {
        const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
        const path = `${submissionId}/${crypto.randomUUID()}.${ext}`;
        await DataAPI.subirFotoEnvio(path, file);
      }

      setFormStatus(status, I18N.t("galeria.fotosForm.enviandoNotif"), "ok");
      await DataAPI.enviarFotos({ submissionId, nombre, email, mensaje });

      setFormStatus(status, I18N.t("galeria.fotosForm.exito"), "ok");
      form.reset();
      if (fileList) fileList.innerHTML = "";
    } catch (err) {
      console.error("Error enviando fotos:", err);
      setFormStatus(status, I18N.t("galeria.fotosForm.error"), "err");
    } finally {
      sending = false;
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

/* ---------- Lightbox/carrusel de la galería ---------- */
function initLightbox(){
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;
  const img = lightbox.querySelector("img");
  const prevBtn = lightbox.querySelector(".lightbox-prev");
  const nextBtn = lightbox.querySelector(".lightbox-next");
  const items = Array.from(document.querySelectorAll("[data-lightbox]"));
  if (!items.length) return;
  let current = 0;

  function show(i){
    current = (i + items.length) % items.length;
    const el = items[current];
    img.src = el.getAttribute("data-lightbox");
    img.alt = el.alt || "";
  }
  function open(i){
    show(i);
    lightbox.classList.add("open");
  }
  function close(){
    lightbox.classList.remove("open");
    img.src = "";
  }

  items.forEach((el, i) => {
    el.addEventListener("click", () => open(i));
  });

  if (prevBtn) prevBtn.addEventListener("click", (e) => { e.stopPropagation(); show(current - 1); });
  if (nextBtn) nextBtn.addEventListener("click", (e) => { e.stopPropagation(); show(current + 1); });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.classList.contains("lightbox-close")) close();
  });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") show(current + 1);
    if (e.key === "ArrowLeft") show(current - 1);
  });

  let touchX = null;
  lightbox.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) { dx < 0 ? show(current + 1) : show(current - 1); }
    touchX = null;
  }, { passive: true });
}

/* =========================================================
   GRILLA DE PROPUESTAS
   Usada por: tours.html, travesias.html, paquetes.html
   (con body[data-tipo-fijo]) y experiencias.html (catálogo
   principal, con body[data-catalogo-full]: chips de tipo +
   selector de destino).
   ========================================================= */
async function renderPropuestasGrid(){
  const grid = document.getElementById("prop-grid");
  if (!grid) return;

  const tipoFijo = document.body.getAttribute("data-tipo-fijo"); // "tour" | "travesia" | "paquete" | null
  const catalogoFull = document.body.hasAttribute("data-catalogo-full"); // experiencias.html (PRO-62)
  const params = new URLSearchParams(window.location.search);
  const destinoFiltro = params.get("destino");
  const tipoFiltro = tipoFijo || params.get("tipo");

  // Contexto explícito (PRO-48) que cada card agrega a su link hacia
  // propuesta.html, para que el botón "← Volver a…" del detalle no
  // dependa de document.referrer. tours.html/travesias.html/paquetes.html
  // (data-tipo-fijo) mandan su propio tipo; experiencias.html
  // (data-catalogo-full) manda "experiencias".
  let volverCtx = "";
  if (tipoFijo && TIPOS_PROPUESTA[tipoFijo]) {
    const origenTipo = TIPOS_PROPUESTA[tipoFijo].pagina.replace(/\.html$/, "");
    volverCtx = `&origen=${origenTipo}${destinoFiltro ? `&destino=${encodeURIComponent(destinoFiltro)}` : ""}`;
  } else if (catalogoFull) {
    // experiencias.html es ahora el catálogo principal (PRO-62): el
    // "← Volver" del detalle debe apuntar acá directo.
    volverCtx = `&origen=experiencias${destinoFiltro ? `&destino=${encodeURIComponent(destinoFiltro)}` : ""}`;
  }

  grid.innerHTML = `<div class="empty-state">${I18N.t("common.loading")}</div>`;

  let destinos, lista;
  try {
    [destinos, lista] = await Promise.all([
      DataAPI.getDestinosActivos(),
      DataAPI.getExperienciasPublicadas({ tipo: tipoFiltro || undefined, destinoSlug: destinoFiltro || undefined })
    ]);
  } catch (err) {
    console.error("Error cargando experiencias:", err);
    grid.innerHTML = `<div class="empty-state">${I18N.t("common.errorExperiencias")}</div>`;
    return;
  }

  // ---- Chips de filtro ----
  // Piezas compartidas por las tres variantes de abajo: opciones del
  // selector de destino (agrupadas por país) y chips de tipo con su
  // click, que conserva el destino filtrado.
  const destinoOptionsHtml = () => {
    let html = `<option value="">${I18N.t("common.todosLosDestinos")}</option>`;
    [...new Set(destinos.map(d => d.pais))].forEach(pais => {
      html += `<optgroup label="${I18N.translateEnum("pais", pais)}">`;
      destinos.filter(d => d.pais === pais && d.disponible).forEach(d => {
        html += `<option value="${d.slug}"${destinoFiltro === d.slug ? " selected" : ""}>${d.nombre}</option>`;
      });
      html += `</optgroup>`;
    });
    return html;
  };
  const tipoChipsHtml = () => {
    let html = `<button class="filtro-btn ${!tipoFiltro ? "active" : ""}" data-tipo="">${I18N.t("common.todos")}</button>`;
    Object.keys(TIPOS_PROPUESTA).forEach(key => {
      html += `<button class="filtro-btn ${tipoFiltro === key ? "active" : ""}" data-tipo="${key}">${TIPOS_PROPUESTA[key].labelPlural}</button>`;
    });
    return html;
  };
  const bindTipoChips = (wrap) => {
    wrap.querySelectorAll(".filtro-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const tipo = btn.getAttribute("data-tipo");
        const p = new URLSearchParams(window.location.search);
        if (tipo) p.set("tipo", tipo); else p.delete("tipo");
        if (destinoFiltro) p.set("destino", destinoFiltro);
        aplicarFiltroSuave(p);
      });
    });
  };

  const filtrosWrap = document.getElementById("prop-filtros");
  if (filtrosWrap) {
    if (tipoFijo) {
      // Dentro de una página de tipo fijo (Tours/Travesías/Paquetes): un
      // único selector "Destino" agrupado por país, en vez de una fila de
      // chips (con Argentina + Perú separados en sus destinos reales, una
      // fila plana se vuelve interminable). Un destino real (esPlaceholder
      // false) siempre aparece, aunque hoy no tenga propuestas de este
      // tipo — así el selector queda listo para Paquetes aunque todavía
      // no tenga nada cargado. Un destino en preparación (esPlaceholder
      // true) sólo aparece si ya tiene alguna propuesta publicada (caso
      // Choquequirao): sin eso se mostraría como una opción comercial
      // activa sin serlo (caso Paracas/Huacachina/Arequipa/Lima, sin
      // ninguna propuesta todavía). d.disponible ya resuelve ese criterio.
      filtrosWrap.innerHTML = `
        <div class="filtro-destino-group">
          <label class="filtro-destino-label" for="prop-destino-select">${I18N.t("common.destinoLabel")}</label>
          <select class="filtro-destino-select" id="prop-destino-select">${destinoOptionsHtml()}</select>
        </div>`;
      const select = document.getElementById("prop-destino-select");
      select.addEventListener("change", () => {
        const slug = select.value;
        const p = new URLSearchParams(window.location.search);
        if (slug) p.set("destino", slug); else p.delete("destino");
        aplicarFiltroSuave(p);
      });
    } else if (catalogoFull) {
      // experiencias.html como catálogo principal (PRO-62): chips de tipo
      // + selector de destino agrupado por país, combinables entre sí
      // (el selector de destino es el mismo que usan tours/travesias/
      // paquetes).
      filtrosWrap.innerHTML = `
        <div class="exp-catalogo-filtros">
          <div class="filtros">${tipoChipsHtml()}</div>
          <div class="filtro-destino-group">
            <label class="filtro-destino-label" for="prop-destino-select">${I18N.t("common.destinoLabel")}</label>
            <select class="filtro-destino-select" id="prop-destino-select">${destinoOptionsHtml()}</select>
          </div>
        </div>`;

      bindTipoChips(filtrosWrap);
      const destinoSelectFull = document.getElementById("prop-destino-select");
      destinoSelectFull.addEventListener("change", () => {
        const slug = destinoSelectFull.value;
        const p = new URLSearchParams(window.location.search);
        if (slug) p.set("destino", slug); else p.delete("destino");
        if (tipoFiltro) p.set("tipo", tipoFiltro);
        aplicarFiltroSuave(p);
      });
    }
  }

  // "Todos" (sin tipo fijo ni filtro de tipo): mezcla Tours/Travesías/
  // Paquetes entre sí en vez de mostrarlos agrupados en bloques. Con un
  // único tipo ya filtrado esto no cambia nada (round-robin de 1 grupo).
  // (El filtro por tipo/destino ya se aplicó del lado de DataAPI.)
  lista = interleaveByTipo(lista);

  if (lista.length === 0) {
    grid.innerHTML = `<div class="empty-state">${I18N.t("common.sinPropuestasFiltro")}</div>`;
  } else {
    grid.innerHTML = lista.map(p => propuestaCardHtml(p, volverCtx)).join("");
  }

  // Quita el estado "apagado" que haya dejado un cambio de filtro anterior,
  // para que el contenido nuevo entre con un fundido suave.
  grid.classList.remove("prop-grid-fading");
}

/* Actualiza la URL sin recargar la página (history.replaceState) y vuelve
   a renderizar la grilla con una transición de opacidad breve, en vez del
   salto brusco que producía window.location.search. */
function aplicarFiltroSuave(params){
  const query = params.toString();
  const nuevaUrl = window.location.pathname + (query ? `?${query}` : "");
  history.replaceState(null, "", nuevaUrl);

  const grid = document.getElementById("prop-grid");
  if (grid) grid.classList.add("prop-grid-fading");

  window.setTimeout(() => {
    renderPropuestasGrid();
  }, 180);
}

// Metadata breve de Travesías para card/carrusel: "Recorrido · Duración".
// El recorrido usa detalle.recorridoMetadata (lugares reales del
// trayecto, curados a mano por experiencia — nunca inventados ni
// derivados de destino_id, que sigue siendo sólo el ancla de
// navegación/filtros) si existe; si no, cae al destino ancla solo. La
// duración se acorta a "N días" (sin el detalle de noches, que sigue
// completo en la ficha) para que la línea entre en una sola línea aun
// con varios lugares. Usada tanto acá como en el carrusel de Inicio.
function travesiaMetaHtml(p){
  const dias = p.duracion ? I18N.translateEnum("duracion", p.duracion.split(" / ")[0]) : p.duracion;
  const lugares = (p.detalle && Array.isArray(p.detalle.recorridoMetadata) && p.detalle.recorridoMetadata.length)
    ? p.detalle.recorridoMetadata.join(" · ")
    : (p.destino ? p.destino.nombre : "");
  return `${lugares} · ${dias}`;
}

function propuestaCardHtml(p, volverCtx){
  const tipoInfo = TIPOS_PROPUESTA[p.tipoProducto];
  const href = `propuesta.html?id=${p.slug}${volverCtx || ""}`;
  // Travesías muestran travesiaMetaHtml (recorrido/destino · duración);
  // Tours/Paquetes mantienen "Duración · Modalidad" como antes. Sólo
  // cambia esta línea resumida — el detalle sigue mostrando Modalidad
  // igual que siempre.
  return `
    <article class="exp-card" data-tipo="${p.tipoProducto}">
      <a class="img-wrap" href="${href}" aria-label="${I18N.t("aria.verDetallesDe")} ${p.nombre}">
        ${p.imagen ? `<img src="${p.imagen}" alt="${p.nombre}" loading="lazy"${p.imagenPos ? ` style="object-position:${p.imagenPos};"` : ""}>` : `<div class="exp-img-fallback"><span>${p.nombre}</span></div>`}
        <span class="cat-badge">${tipoInfo ? tipoInfo.label : p.tipoProducto}</span>
        <div class="img-meta">${p.tipoProducto === "travesia" ? travesiaMetaHtml(p) : `${I18N.translateEnum("duracion", p.duracion)} · ${I18N.translateEnum("modalidad", p.modalidad)}`}</div>
      </a>
      <div class="body">
        ${p.esPlaceholder ? `<span class="placeholder-badge">${I18N.t("common.contenidoEjemplo")}</span>` : ""}
        <span class="dest-tag">${p.destino ? p.destino.nombre : ""}</span>
        <h3>${p.nombre}</h3>
        <p class="resumen">${p.resumen}</p>
        <div class="actions">
          <a class="btn btn-sm" href="${href}">${I18N.t("common.verDetalles")}</a>
          <a class="btn btn-outline on-light btn-sm" href="contacto.html?propuesta=${encodeURIComponent(p.nombre)}">${I18N.t("nav.reserva")}</a>
        </div>
      </div>
    </article>`;
}

/* ---------- Calendario de próximas salidas ----------
   Sólo actúa si la página tiene #calendario-grid (calendario.html).
   Deliberadamente NO deriva salidas de detalle.fechas de Tours/
   Travesías/Paquetes: ese campo describe fechas propias de cada
   experiencia en su propia ficha, no una curaduría de qué publicar acá.
   Hasta que se defina explícitamente una fuente de datos para
   Calendario, la página queda en su estado vacío. */
function renderCalendarioSalidas(){
  const grid = document.getElementById("calendario-grid");
  if (!grid) return;
  const emptyState = document.getElementById("calendario-empty");

  grid.innerHTML = "";
  grid.hidden = true;
  if (emptyState) emptyState.hidden = false;
}

/* ---------- Navegación contextual "← Volver a…" (PRO-48) ----------
   Botón discreto y secundario, complementario al breadcrumb (no lo
   reemplaza). Determinista: nunca usa history.back(), sólo enlaces
   internos ya resueltos por quien la llama (renderPropuestaDetalle
   según el mismo contexto que arma el breadcrumb). Sin contexto válido (href/label null), el link queda
   oculto — no aparece "Volver" en accesos directos. */
function setVolverLink(id, href, label){
  const el = document.getElementById(id);
  if (!el) return;
  if (!href || !label) { el.style.display = "none"; return; }
  el.href = href;
  el.textContent = `${I18N.t("common.volverPrefix")} ${label}`;
  el.style.display = "inline-block";
}

/* =========================================================
   DETALLE DE PROPUESTA (propuesta.html)
   La ficha lee "tipoProducto" y arma automáticamente los bloques
   específicos a partir de "detalle" (jsonb de la experiencia en Supabase).
   Cada helper de abajo sabe leer el "detalle" de UN tipo y
   devuelve dos partes: bloques para el cuerpo (bodyHtml) y
   filas para la tarjeta lateral (asideHtml). Los campos que
   no estén cargados simplemente no se muestran.
   ========================================================= */
async function renderPropuestaDetalle(){
  const cont = document.getElementById("prop-detalle");
  if (!cont) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const notFoundHtml = `
    <div class="empty-state">
      ${I18N.t("common.noEncontramosPropuesta")}<br>
      <a class="btn btn-sm" style="margin-top:16px;" href="destinos.html">${I18N.t("common.volverADestinos")}</a>
    </div>`;

  let p;
  try {
    p = id ? await DataAPI.getExperienciaPorSlug(id) : null;
  } catch (err) {
    console.error("Error cargando la propuesta:", err);
    cont.innerHTML = `<div class="empty-state">${I18N.t("common.errorPropuesta")}</div>`;
    return;
  }

  // Una propuesta no publicada se trata igual que una inexistente: no
  // debe poder verse por más que alguien conozca o adivine su id/URL.
  if (!p || !p.publicado) {
    cont.innerHTML = notFoundHtml;
    document.title = I18N.t("common.tituloNoEncontradaPropuesta");
    return;
  }

  const tipoInfo = TIPOS_PROPUESTA[p.tipoProducto];
  document.title = `${p.nombre} — Proyecto Raíces`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", p.resumen);

  let galeriaRows = [];
  try {
    galeriaRows = await DataAPI.getGaleria(p.id);
  } catch (err) {
    console.error("Error cargando la galería:", err);
  }
  // Cada foto con su propio encuadre: el "foco" de esa imagen en la
  // galería; el encuadre de la card (p.imagenPos) sólo vale para la
  // misma foto de la card, no para otra imagen distinta.
  // La imagen principal del detalle es SIEMPRE la portada de la card
  // (p.imagen, con su mismo encuadre): si no está entre las filas de la
  // galería se antepone, así siempre se puede volver a ella.
  const galeria = galeriaRows.map(g => ({ url: g.url, pos: g.foco || (g.url === p.imagen ? p.imagenPos : null) || null }));
  if (p.imagen) {
    const i = galeria.findIndex(g => g.url === p.imagen);
    if (i >= 0) galeria.splice(i, 1);
    galeria.unshift({ url: p.imagen, pos: p.imagenPos || null });
  }
  const principal = galeria[0] ? galeria[0].url : null;
  const principalPos = galeria[0] ? galeria[0].pos : null;

  const bcEl = document.getElementById("exp-breadcrumb");
  if (bcEl) {
    let volverHref = tipoInfo ? tipoInfo.pagina : "destinos.html";
    let volverLabel = tipoInfo ? tipoInfo.labelPlural : I18N.t("common.propuestas");
    // Sólo true cuando el referrer coincidió con un contexto interno
    // real (catálogo por destino, o la propia página de tipo fijo con
    // filtro) — no con el fallback por defecto. El botón "← Volver a…"
    // (PRO-48) reutiliza exactamente este mismo destino/label; en un
    // acceso directo (sin ese contexto) el botón no debe mostrarse.
    let tieneContexto = false;
    // Contexto explícito por query params (PRO-48): ya no depende de
    // document.referrer. Las cards que llevan a propuesta.html (ver
    // propuestaCardHtml en este mismo archivo) agregan "?origen=" y,
    // cuando corresponde, "&destino=".
    const origen = params.get("origen"); // "experiencias" | "destino" | "tours" | "travesias" | "paquetes" | null
    const destinoCtxSlug = params.get("destino");
    try {
      if (origen === "destino" && destinoCtxSlug) {
        // Venís de la ficha editorial del destino (PRO-34), no del
        // catálogo: "Volver" te lleva de nuevo ahí.
        const refDestinoEditorial = await DataAPI.getDestinoPorSlug(destinoCtxSlug);
        volverHref = `destino.html?destino=${encodeURIComponent(destinoCtxSlug)}`;
        volverLabel = refDestinoEditorial ? refDestinoEditorial.nombre : I18N.t("common.destinoLabel");
        tieneContexto = true;
      } else if (tipoInfo && origen === tipoInfo.pagina.replace(/\.html$/, "")) {
        // Contexto válido con o sin filtro de destino — si no había
        // ?destino=, volverHref no cambia (ya apuntaba a tipoInfo.pagina
        // por defecto).
        volverHref = tipoInfo.pagina + (destinoCtxSlug ? `?destino=${encodeURIComponent(destinoCtxSlug)}` : "");
        tieneContexto = true;
      } else if (origen === "experiencias") {
        // experiencias.html es el catálogo principal (PRO-62): el
        // "← Volver" apunta directo ahí (con el destino filtrado, si
        // había uno), sin nivel intermedio.
        volverHref = `experiencias.html${destinoCtxSlug ? `?destino=${encodeURIComponent(destinoCtxSlug)}` : ""}`;
        volverLabel = I18N.t("nav.experiencias");
        tieneContexto = true;
      }
    } catch (e) { /* sin contexto válido: se usa el destino por defecto */ }
    bcEl.innerHTML = `<a href="index.html">${I18N.t("common.inicio")}</a> / <a href="${volverHref}">${volverLabel}</a> / ${p.nombre}`;
    setVolverLink("prop-volver", tieneContexto ? volverHref : null, tieneContexto ? volverLabel : null);
  }

  // Nota de reserva privada/logística (PRO-XX): vive junto a Detalle,
  // no en el cuerpo de la ficha — no interrumpe la lectura de la
  // Descripción ni duplica el badge "Personalizable" (funciones
  // distintas: el badge comunica la característica, esta nota explica
  // la condición de reserva).
  const notaReservaHtml = p.tipoProducto === "tour"
    ? `<div class="notice-box">${I18N.t("propuesta.notaReserva.salida")}</div>`
    : p.tipoProducto === "travesia"
    ? `<div class="notice-box">${I18N.t("propuesta.notaReserva.travesia")}</div>`
    : p.tipoProducto === "paquete"
    ? `<div class="notice-box">${I18N.t("propuesta.notaReserva.paquete")}</div>`
    : "";

  const consultaHref = `contacto.html?propuesta=${encodeURIComponent(p.nombre)}`;
  // Tours y Travesías: el CTA principal va directo a WhatsApp con el
  // nombre de la propuesta precargado (whatsappLink ya arma la URL con
  // el mensaje codificado).
  const tourWaHref = p.tipoProducto === "tour"
    ? whatsappLink(I18N.t("propuesta.whatsappTour", { nombre: p.nombre }))
    : null;
  const travesiaWaHref = p.tipoProducto === "travesia"
    ? whatsappLink(I18N.t("propuesta.whatsappTravesia", { nombre: p.nombre }))
    : null;

  // Bloques específicos según el tipo (leídos de p.detalle + relaciones)
  const especifico = await renderDetalleEspecifico(p);

  cont.innerHTML = `
    ${p.esPlaceholder ? `<div class="notice-box">${I18N.t("propuesta.placeholderNotice")}</div>` : ""}
    <div class="exp-detail-grid" style="margin-top:28px;">
      <div>
        <div class="exp-gallery-main">
          ${principal ? `<img src="${principal}" alt="${p.nombre}" id="exp-main-img"${principalPos ? ` style="object-position:${principalPos};"` : ""}>` : `<div class="exp-img-fallback"><span>${p.nombre}</span></div>`}
        </div>
        ${galeria.length > 1 ? `
        <div class="exp-gallery-thumbs">
          ${galeria.map(g => `<img src="${g.url}" alt="${p.nombre}" style="cursor:pointer;${g.pos ? ` object-position:${g.pos};` : ""}" data-pos="${g.pos || ""}">`).join("")}
        </div>` : ""}

        <div class="exp-body">
          <h2 class="mt-0">${I18N.t("propuesta.descripcion")}</h2>
          <p>${p.descripcion}</p>

          ${especifico.bodyHtml}

          ${p.incluye && p.incluye.length ? `<h2>${I18N.t("propuesta.queIncluye")}</h2><ul class="check-list">${p.incluye.map(i => `<li>${i}</li>`).join("")}</ul>` : ""}

          ${p.noIncluye && p.noIncluye.length ? `<h2>${I18N.t("propuesta.queNoIncluye")}</h2><ul class="cross-list">${p.noIncluye.map(i => `<li>${i}</li>`).join("")}</ul>` : ""}

          ${p.infoImportante ? `<h2>${I18N.t("propuesta.infoImportante")}</h2><p>${p.infoImportante}</p>` : ""}
        </div>
      </div>

      <aside class="exp-info-card">
        <span class="dest-tag">${tipoInfo ? tipoInfo.label : p.tipoProducto}</span>
        <h1 style="margin-top:8px;">${p.nombre}</h1>
        ${especifico.badgeHtml}
        ${detalleBaseHtml(p)}
        ${p.precio ? `<div class="info-row"><span>${I18N.t("propuesta.precio")}</span><b>${p.precio}</b></div>` : ""}
        ${notaReservaHtml}
        ${p.tipoProducto === "tour"
          ? `<a class="btn" href="${tourWaHref || consultaHref}"${tourWaHref ? ` target="_blank" rel="noopener"` : ""}>${I18N.t("nav.reserva")}</a>`
          : p.tipoProducto === "travesia"
          ? `<a class="btn" href="${travesiaWaHref || consultaHref}"${travesiaWaHref ? ` target="_blank" rel="noopener"` : ""}>${I18N.t("nav.reserva")}</a>`
          : `<a class="btn" href="${consultaHref}">${I18N.t("nav.reserva")}</a>
        <a class="btn btn-outline on-light btn-block" style="margin-top:10px;" href="${consultaHref}">${I18N.t("common.solicitarInformacion")}</a>`}
      </aside>
    </div>
  `;

  // Miniaturas: cambian la foto principal junto con su propio encuadre.
  const mainImg = document.getElementById("exp-main-img");
  cont.querySelectorAll(".exp-gallery-thumbs img").forEach(th => {
    th.addEventListener("click", () => {
      if (!mainImg) return;
      mainImg.src = th.getAttribute("src");
      mainImg.style.objectPosition = th.dataset.pos || "";
    });
  });
}

/* ---- Router: elige el helper según p.tipoProducto ---- */
async function renderDetalleEspecifico(p){
  const vacio = { bodyHtml: "", badgeHtml: "" };
  if (!p.detalle) return vacio;
  if (p.tipoProducto === "tour") return renderDetalleTour(p.detalle);
  if (p.tipoProducto === "travesia") return renderDetalleTravesia(p.detalle);
  if (p.tipoProducto === "paquete") return renderDetallePaquete(p.detalle, p);
  return vacio;
}

/* ---- Helpers genéricos de armado (reutilizados por los 3 tipos) ---- */
function infoRowSiHay(label, valor){
  if (!valor) return "";
  return `<div class="info-row"><span>${label}</span><b>${valor}</b></div>`;
}

function listaSiHay(titulo, items, listClass){
  if (!items || !items.length) return "";
  return `<h2>${titulo}</h2><ul class="${listClass || ""}">${items.map(i => `<li>${i}</li>`).join("")}</ul>`;
}

function itinerarioSiHay(itinerario){
  if (!itinerario || !itinerario.length) return "";
  const dias = itinerario.map(d => `<li><b>${I18N.t("detalle.dia")} ${d.dia}${d.titulo ? " — " + d.titulo : ""}</b>${d.descripcion ? `<br>${d.descripcion}` : ""}</li>`).join("");
  return `<h2>${I18N.t("detalle.itinerario")}</h2><ul class="check-list">${dias}</ul>`;
}

function personalizableBadge(esPersonalizable){
  if (!esPersonalizable) return "";
  return `<span class="placeholder-badge badge-personalizable">${I18N.t("detalle.personalizable")}</span>`;
}

function fechasSiHay(fechas, nota){
  if (!fechas || !fechas.length) return "";
  const notaHtml = nota ? `<small class="nota">${nota}</small>` : "";
  return `<div class="info-row"><span>${I18N.t("detalle.fechas")}</span><b>${fechas.join(" · ")}${notaHtml}</b></div>`;
}

/* ---- Detalle: set fijo de campos por tipo_producto ----
   Única fuente de verdad de qué se muestra en el bloque "Detalle" de la
   ficha pública: Supabase puede tener muchos más atributos en
   detalle{}, pero acá se decide, una sola vez por tipo, cuáles son
   relevantes para el usuario. Todo lo que no exista se oculta solo
   (infoRowSiHay/fechasSiHay), sin fallback ni valor inventado. */
function detalleBaseHtml(p){
  const d = p.detalle || {};
  let html = "";
  html += infoRowSiHay(I18N.t("common.destinoLabel"), p.destino ? p.destino.nombre : "");
  html += infoRowSiHay(I18N.t("detalle.duracion"), I18N.translateEnum("duracion", p.duracion));
  html += infoRowSiHay(I18N.t("detalle.modalidad"), I18N.translateEnum("modalidad", p.modalidad));

  if (p.tipoProducto === "tour") {
    html += infoRowSiHay(I18N.t("detalle.dificultad"), I18N.translateEnum("dificultad", d.dificultad));
    html += infoRowSiHay(I18N.t("detalle.fecha"), d.fecha);
    html += infoRowSiHay(I18N.t("detalle.salida"), d.salida);
    html += infoRowSiHay(I18N.t("detalle.regreso"), d.regreso);
  } else if (p.tipoProducto === "travesia") {
    html += infoRowSiHay(I18N.t("detalle.dificultad"), I18N.translateEnum("dificultad", d.dificultad));
    html += fechasSiHay(d.fechas, d.fechasNota);
  } else if (p.tipoProducto === "paquete") {
    html += fechasSiHay(d.fechas, d.fechasNota);
  }
  return html;
}

/* ---- TOUR: actividad de un día ---- */
function renderDetalleTour(d){
  let bodyHtml = "";
  if (d.combinableConOtrosTours) {
    bodyHtml += `<div class="notice-box">${I18N.t("detalle.combinable")}${d.seConvierteEnTravesiaAlCombinar ? I18N.t("detalle.combinableConvierte") : ""}</div>`;
  }
  bodyHtml += listaSiHay(I18N.t("detalle.recorrido"), d.recorrido, "check-list");
  bodyHtml += itinerarioSiHay(d.itinerarioCombinado);

  return { bodyHtml, badgeHtml: "" };
}

/* ---- TRAVESÍA: varios días, personalizable ---- */
function renderDetalleTravesia(d){
  let bodyHtml = "";
  bodyHtml += itinerarioSiHay(d.itinerario);
  bodyHtml += listaSiHay(I18N.t("detalle.logisticaNoIncluida"), d.logisticaNoIncluida, "cross-list");

  return { bodyHtml, badgeHtml: personalizableBadge(d.personalizable) };
}

/* ---- PAQUETE: viaje integral, personalizable ----
   Las experiencias que integra el paquete, y las actividades que
   incluye, ya no viven en "detalle" (d.toursIncluidos/travesiasIncluidas/
   actividades no existen más en Supabase): se resuelven vía
   paquete_experiencias. Las actividades del paquete se derivan de las
   actividades de esas experiencias relacionadas (no se cargan aparte).
   Hoy ningún paquete tiene relaciones cargadas todavía (el único
   paquete, de ejemplo, no está publicado), así que estas listas
   simplemente no aparecen — no se inventa ningún dato para completarlas. */
async function renderDetallePaquete(d, p){
  let bodyHtml = "";
  bodyHtml += itinerarioSiHay(d.itinerario);

  let relaciones = [];
  try {
    relaciones = await DataAPI.getExperienciasDeUnPaquete(p.id);
  } catch (err) {
    console.error("Error cargando las experiencias del paquete:", err);
  }
  const incluidas = relaciones.map(r => r.experiencia).filter(Boolean);

  const actividadesIncluidas = [...new Map(
    incluidas.flatMap(e => e.actividades).map(a => [a.slug, a.nombre])
  ).values()];
  bodyHtml += listaSiHay(I18N.t("detalle.actividadesIncluidas"), actividadesIncluidas, "check-list");

  const toursLinkeados = incluidas.filter(e => e.tipoProducto === "tour");
  const travesiasLinkeadas = incluidas.filter(e => e.tipoProducto === "travesia");
  if (toursLinkeados.length) {
    bodyHtml += `<h2>${I18N.t("detalle.toursIncluidos")}</h2><ul class="check-list">${toursLinkeados.map(t => `<li><a href="propuesta.html?id=${t.slug}">${t.nombre}</a></li>`).join("")}</ul>`;
  }
  if (travesiasLinkeadas.length) {
    bodyHtml += `<h2>${I18N.t("detalle.travesiasIncluidas")}</h2><ul class="check-list">${travesiasLinkeadas.map(t => `<li><a href="propuesta.html?id=${t.slug}">${t.nombre}</a></li>`).join("")}</ul>`;
  }

  return { bodyHtml, badgeHtml: personalizableBadge(d.personalizable) };
}

/* =========================================================
   PÁGINA EDITORIAL DE DESTINO (destino.html?destino=slug) — PRO-34
   Plantilla única para los 12 destinos: contenido editorial e
   informativo del lugar primero (identidad, fotos reales, datos
   reales del destino), acceso secundario a "ver todo en el catálogo"
   (experiencias.html?destino=slug) después — no duplica esa grilla acá,
   sólo muestra las experiencias reales de este destino con el mismo
   componente (propuestaCardHtml) que ya usa el resto del sitio.
   Nunca inventa contenido: lo que no existe todavía en la ficha del
   destino se muestra con placeholder-badge, el mismo componente que
   ya usan las propuestas de ejemplo y los perfiles de equipo pendientes.
   ========================================================= */
async function renderDestinoEditorial(){
  const cont = document.getElementById("destino-editorial");
  if (!cont) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("destino");

  const notFoundHtml = `
    <div class="empty-state" style="padding-top:150px;">
      ${I18N.t("common.noEncontramosDestino")}<br>
      <a class="btn btn-sm" style="margin-top:16px;" href="destinos.html">${I18N.t("common.volverADestinos")}</a>
    </div>`;

  let d, experiencias;
  try {
    [d, experiencias] = await Promise.all([
      slug ? DataAPI.getDestinoPorSlug(slug) : Promise.resolve(null),
      slug ? DataAPI.getExperienciasPorDestino(slug) : Promise.resolve([])
    ]);
  } catch (err) {
    console.error("Error cargando el destino:", err);
    cont.innerHTML = `<div class="empty-state" style="padding-top:150px;">${I18N.t("common.errorDestino")}</div>`;
    return;
  }

  if (!d) {
    cont.innerHTML = notFoundHtml;
    document.title = I18N.t("common.tituloNoEncontradoDestino");
    return;
  }

  const nombre = d.nombre;
  document.title = `${nombre} — Proyecto Raíces`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && d.resumen) metaDesc.setAttribute("content", d.resumen);

  // Mismo criterio que ya usa destinos.html: d.disponible
  // (no d.esPlaceholder) decide si el destino se trata como "Próximamente"
  // — ya contempla el caso Choquequirao (ficha con esPlaceholder:true pero
  // con una experiencia publicada, que por eso no debe verse como pendiente).
  const disponible = d.disponible;
  const coverImg = d.imagen
    ? `<img class="${!disponible ? "placeholder" : ""}" src="${d.imagen}" alt="${nombre}, ${I18N.translateEnum("pais", d.pais)}" style="object-position:${d.imagenPos || "center"};">`
    : `<div class="exp-img-fallback"><span>${nombre}</span></div>`;
  const prepFlag = !disponible ? `<span class="destino-card-flag" style="position:static; display:inline-block; vertical-align:middle; margin-left:10px;">${I18N.t("common.proximamente")}</span>` : "";

  // "En este lugar" — composición editorial con foto protagonista +
  // secundarias, armada con las fotos reales de las experiencias ya
  // publicadas de este destino (sin repetir la misma imagen dos veces,
  // sin inventar ni pedir fotos externas). Como mucho 4 fotos: son las
  // que encabezan la composición, no un listado completo — la galería
  // completa de cada experiencia se ve en su propia ficha.
  const fotos = [];
  experiencias.forEach(p => {
    if (p.imagen && !fotos.some(f => f.src === p.imagen)) fotos.push({ src: p.imagen, alt: p.nombre, pos: p.imagenPos || "center" });
  });
  const fotosUsadas = fotos.slice(0, 4);
  const galeriaHtml = fotosUsadas.length
    ? `<div class="destino-fotos" data-fotos="${fotosUsadas.length}">${fotosUsadas.map((f, i) => `
        <div class="g-foto g-${i + 1}"><img src="${f.src}" alt="${f.alt}" style="object-position:${f.pos};" data-lightbox="${f.src}" loading="lazy"></div>`).join("")}</div>`
    : `<div class="destino-fotos" data-fotos="1"><div class="g-foto g-1" style="aspect-ratio:1.9;"><div class="exp-img-fallback"><span>${nombre}</span></div></div></div>`;

  // Presentación editorial del destino, ahora parte del propio hero (ya
  // no una sección aparte): mismo resumen que ya usa el intro, con un
  // placeholder honesto si todavía no está cargado (nunca contenido
  // inventado).
  const presentaTexto = d.resumen || I18N.t("destino.presentaTexto", { nombre });

  // Los tres tópicos editoriales del destino (Cuándo ir / Cómo llegar /
  // Naturaleza y cultura), dentro de la MISMA columna de texto que
  // nombre/país/presentación (no un bloque aparte debajo de la grilla):
  // subtítulos chicos en amarillo, contenido secundario, continuidad
  // vertical con el resto del hero, sin cards ni columnas iguales. Los
  // destinos que todavía no tienen cargado un campo (cuando_ir/
  // como_llegar/naturaleza_cultura en Supabase) muestran "Próximamente".
  const heroTopicosHtml = `
    <div class="destino-hero-topicos">
      <div class="destino-hero-topico"><h3>${I18N.t("destino.cuandoIr")}</h3><p>${d.cuandoIr || I18N.t("common.proximamente")}</p></div>
      <div class="destino-hero-topico"><h3>${I18N.t("destino.comoLlegar")}</h3><p>${d.comoLlegar || I18N.t("common.proximamente")}</p></div>
      <div class="destino-hero-topico"><h3>${I18N.t("destino.naturalezaCultura")}</h3><p>${d.naturalezaCultura || I18N.t("common.proximamente")}</p></div>
    </div>`;

  // Volver a esta ficha de destino desde propuesta.html (PRO-48): mismo
  // mecanismo de "origen"/"destino" por query param que ya usan
  // las páginas de tipo fijo.
  const volverCtx = `&origen=destino&destino=${encodeURIComponent(d.slug)}`;

  // Destino ya no duplica el catálogo: en vez de una card comercial (con
  // botones y descripción), muestra una sola experiencia destacada (la
  // marcada como tal, o la primera por orden) como pieza editorial mínima
  // — foto + nombre superpuesto, sin card ni CTA propio — seguida del mismo
  // botón (.btn) que ya usan las cards del sitio, hacia
  // experiencias.html?destino= — el catálogo general, que ya sabe filtrar
  // por destino (PRO-62). El texto pequeño sobre la foto ("Tipo en
  // Destino") ata la experiencia al relato del propio destino en vez de
  // sentirse un elemento aislado.
  const destacada = experiencias.find(p => p.destacada) || experiencias[0] || null;
  const tipoDestacada = destacada ? TIPOS_PROPUESTA[destacada.tipoProducto] : null;
  const teaserHtml = destacada
    ? `<a class="destino-exp-destacada" href="propuesta.html?id=${destacada.slug}${volverCtx}" aria-label="${I18N.t("aria.ver")} ${destacada.nombre}">
         ${destacada.imagen
           ? `<img src="${destacada.imagen}" alt="${destacada.nombre}"${destacada.imagenPos ? ` style="object-position:${destacada.imagenPos};"` : ""} loading="lazy">`
           : `<div class="exp-img-fallback"><span>${destacada.nombre}</span></div>`}
         <div class="destino-exp-destacada-info">
           ${tipoDestacada ? `<span class="destino-exp-destacada-tipo">${I18N.t("destino.tipoEnNombre", { tipo: tipoDestacada.label, nombre })}</span>` : ""}
           <h3>${destacada.nombre}</h3>
         </div>
       </a>
       <a class="btn destino-exp-cta" href="experiencias.html?destino=${d.slug}">${I18N.t("destino.verTodasExperienciasDe", { nombre })}</a>`
    : `<div class="empty-state">${I18N.t("common.sinExperienciasDestino")}</div>`;

  cont.innerHTML = `
    <section class="page-intro">
      <div class="wrap">
        <div class="breadcrumb"><a href="index.html">${I18N.t("common.inicio")}</a> / <a href="destinos.html">${I18N.t("nav.destinos")}</a> / ${nombre}</div>
        <div class="page-intro-grid">
          <div class="page-intro-text compact">
            <div class="kicker">${I18N.translateEnum("pais", d.pais)}</div>
            <h1>${nombre}${prepFlag}</h1>
            <p class="destino-hero-intro">${presentaTexto}</p>
            ${heroTopicosHtml}
          </div>
          <div class="page-intro-media">${coverImg}</div>
        </div>
      </div>
    </section>

    <section>
      <div class="wrap">
        <div class="section-head">
          <div class="kicker">${I18N.t("destino.enEsteLugar.kicker")}</div>
          <h2>${I18N.t("destino.enEsteLugar.h2")}</h2>
        </div>
        ${galeriaHtml}
      </div>
    </section>

    <section>
      <div class="wrap">
        <div class="section-head">
          <div class="kicker">${I18N.t("nav.experiencias")}</div>
          <h2>${I18N.t("destino.experiencias.h2", { nombre })}</h2>
        </div>
        ${teaserHtml}
      </div>
    </section>

    <section class="cta-band">
      <div class="wrap">
        <h2>${I18N.t("destino.cta.h2", { nombre })}</h2>
        <p>${I18N.t("destino.cta.p")}</p>
        <div class="hero-ctas"><a href="contacto.html" class="btn">${I18N.t("nav.reserva")}</a></div>
      </div>
    </section>`;

  // initLightbox() ya corrió en el DOMContentLoaded inicial, antes de que
  // esta función arme "En este lugar" — se vuelve a llamar acá, ahora que
  // las fotos con [data-lightbox] ya existen en el DOM.
  initLightbox();
}

/* =========================================================
   EQUIPO (nosotros.html + resumen del equipo en Inicio)
   Un único fetch (DataAPI.getEquipoActivo, memoizado) alimenta los
   contenedores que puede haber en la página, cada uno con su propia
   clase/markup pero sin duplicar la consulta ni la lógica de estados:
     #equipo-grid       → nosotros.html (equipo-persona/equipo-foto)
     #equipo-mini-grid  → index.html (equipo-mini-persona/equipo-mini-foto)
   Ninguno de los dos trae el equipo hardcodeado en el HTML: ambos
   arrancan en un estado de carga (".empty-state", ya en el HTML) y, si
   la consulta falla o vuelve vacía, se reemplaza por un estado explícito
   — nunca se inventan datos ni se vuelve a nombres fijos.
   ========================================================= */
async function renderEquipoGrid(){
  const contenedores = [
    { el: document.getElementById("equipo-grid"), prefix: "equipo" },
    { el: document.getElementById("equipo-mini-grid"), prefix: "equipo-mini" }
  ].filter(c => c.el);
  if (!contenedores.length) return;

  let equipo = [];
  try {
    equipo = await DataAPI.getEquipoActivo();
  } catch (err) {
    console.error("Error cargando el equipo:", err);
    contenedores.forEach(c => { c.el.innerHTML = `<p class="empty-state">${I18N.t("common.errorInfo")}</p>`; });
    return;
  }

  const personaHtml = (m, prefix) => `
    <figure class="${prefix}-persona">
      <div class="${prefix}-foto"><img src="${m.imagen}" alt="${m.nombre}${I18N.t("equipo.parteDelEquipo")}"${m.imagenPos ? ` style="object-position:${m.imagenPos};"` : ""} loading="lazy"></div>
      <figcaption>
        <h3>${m.nombre}</h3>
        ${m.rol ? `<p>${m.rol}</p>` : ""}
      </figcaption>
    </figure>`;

  contenedores.forEach(c => {
    c.el.innerHTML = equipo.length
      ? equipo.map(m => personaHtml(m, c.prefix)).join("")
      : `<p class="empty-state">${I18N.t("common.sinIntegrantes")}</p>`;
  });
}

/* ---------- Galería: filas justificadas (sin recortar ni deformar) ----------
   .gal-row trae las fotos en flexbox simple (fallback si falla JS).
   Acá las agrupamos en filas que ocupan todo el ancho, dándole a cada
   foto de la fila la misma altura y respetando su proporción real
   (nada de object-fit:cover). Se recalcula en resize. */
function initGaleriaJustify(){
  const row = document.querySelector(".gal-row");
  if (!row) return;
  const imgs = Array.from(row.querySelectorAll("img"));
  if (!imgs.length) return;

  function targetHeight(){
    const w = window.innerWidth;
    if (w <= 640) return 130;
    if (w <= 960) return 200;
    return 300;
  }

  function justify(){
    const gap = 12;
    const contW = row.clientWidth;
    const targetH = targetHeight();
    const maxH = targetH * 1.35;
    let group = [], sumAr = 0;

    imgs.forEach((img, i) => {
      const ar = (img.naturalWidth && img.naturalHeight) ? img.naturalWidth / img.naturalHeight : 1.5;
      group.push({ img, ar });
      sumAr += ar;
      const isLast = i === imgs.length - 1;
      const rowW = sumAr * targetH + (group.length - 1) * gap;
      if (rowW >= contW || isLast) {
        let rowH = (contW - (group.length - 1) * gap) / sumAr;
        if (isLast && rowH > maxH) rowH = targetH;
        rowH = Math.min(rowH, maxH);
        group.forEach(g => {
          g.img.style.height = rowH + "px";
          g.img.style.width = (g.ar * rowH) + "px";
        });
        group = []; sumAr = 0;
      }
    });
  }

  let pending = imgs.filter(img => !img.complete);
  if (!pending.length) {
    justify();
  } else {
    let left = pending.length;
    pending.forEach(img => {
      img.addEventListener("load", () => { left--; if (left <= 0) justify(); });
      img.addEventListener("error", () => { left--; if (left <= 0) justify(); });
    });
    justify(); // resultado provisorio mientras cargan
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(justify, 150);
  });
}

/* =========================================================
   CARRUSEL DE COMENTARIOS (Inicio)
   Lee los datos de comentarios-data.js (array "comentarios")
   y arma el carrusel entero (slides + puntos) desde ahí: el
   HTML nunca tiene reseñas escritas a mano. Sólo actúa si la
   página tiene #testi-track (por ahora, únicamente index.html).
   Autoplay con pausa en hover/foco y reinicio del intervalo
   ante una interacción manual, para que el movimiento
   automático no compita con el usuario. Respeta
   prefers-reduced-motion desactivando el autoplay.
   ========================================================= */
function initTestimoniosCarousel(){
  const carousel = document.getElementById("testi-carousel");
  const track = document.getElementById("testi-track");
  const dotsWrap = document.getElementById("testi-dots");
  if (!carousel || !track || !dotsWrap) return;
  const seccion = carousel.closest("section");
  // Sin reseñas reales cargadas todavía (comentarios-data.js vacío):
  // se oculta toda la sección en vez de mostrar el carrusel vacío o
  // contenido de ejemplo como si fuera real.
  if (typeof comentarios === "undefined" || !comentarios.length) {
    if (seccion) seccion.hidden = true;
    return;
  }
  if (seccion) seccion.hidden = false;

  track.innerHTML = comentarios.map((c, i) => `
    <li class="testi-slide${i === 0 ? " is-active" : ""}" role="group" aria-roledescription="comentario" aria-label="${i + 1} ${I18N.t("aria.de")} ${comentarios.length}"${i === 0 ? "" : " aria-hidden=\"true\""}>
      <div class="testi-card">
        <div class="stars" aria-hidden="true">${"★".repeat(c.estrellas)}${"☆".repeat(5 - c.estrellas)}</div>
        <p>"${c.texto}"</p>
        <div class="testi-name">${c.nombre}</div>
        <div class="testi-role">${c.destino} · ${c.experiencia}</div>
      </div>
    </li>`).join("");

  dotsWrap.innerHTML = comentarios.map((_, i) => `
    <button type="button" class="testi-dot${i === 0 ? " is-active" : ""}" aria-label="${I18N.t("aria.irAComentario")} ${i + 1} ${I18N.t("aria.de")} ${comentarios.length}" aria-current="${i === 0 ? "true" : "false"}"></button>`).join("");

  const slides = Array.from(track.querySelectorAll(".testi-slide"));
  const dots = Array.from(dotsWrap.querySelectorAll(".testi-dot"));
  const prevBtn = carousel.querySelector(".testi-arrow.prev");
  const nextBtn = carousel.querySelector(".testi-arrow.next");
  const intervalMs = parseInt(carousel.dataset.autoplay, 10) || 6000;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let current = 0;
  let timer = null;

  function goTo(index){
    const nextIndex = (index + slides.length) % slides.length;
    if (nextIndex === current) return;
    slides[current].classList.remove("is-active");
    slides[current].setAttribute("aria-hidden", "true");
    dots[current].classList.remove("is-active");
    dots[current].setAttribute("aria-current", "false");
    current = nextIndex;
    slides[current].classList.add("is-active");
    slides[current].removeAttribute("aria-hidden");
    dots[current].classList.add("is-active");
    dots[current].setAttribute("aria-current", "true");
  }
  function next(){ goTo(current + 1); }
  function prev(){ goTo(current - 1); }

  function stopAutoplay(){
    if (timer) { clearInterval(timer); timer = null; }
  }
  function startAutoplay(){
    stopAutoplay();
    if (prefersReducedMotion || slides.length < 2) return;
    timer = setInterval(next, intervalMs);
  }

  if (slides.length > 1) {
    prevBtn.addEventListener("click", () => { prev(); startAutoplay(); });
    nextBtn.addEventListener("click", () => { next(); startAutoplay(); });
    dots.forEach((dot, i) => dot.addEventListener("click", () => { goTo(i); startAutoplay(); }));

    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);
    carousel.addEventListener("focusin", stopAutoplay);
    carousel.addEventListener("focusout", (e) => {
      if (!carousel.contains(e.relatedTarget)) startAutoplay();
    });
  } else {
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
    dotsWrap.style.display = "none";
  }

  startAutoplay();
}

/* ---------- Grilla de comentarios (comentarios.html) ----------
   Misma fuente de datos que el carrusel de Inicio (comentarios-data.js):
   agregar/sacar una reseña ahí actualiza las dos superficies. Sin
   reseñas reales cargadas, muestra un estado vacío honesto en vez de
   contenido de ejemplo. */
function initComentariosGrid(){
  const grid = document.getElementById("comentarios-grid");
  if (!grid || typeof comentarios === "undefined") return;
  if (!comentarios.length) {
    grid.innerHTML = `<p class="empty-state" style="grid-column:1/-1;">${I18N.t("common.sinResenas")}</p>`;
    return;
  }
  grid.innerHTML = comentarios.map(c => `
    <div class="testi-card">
      <div class="stars">${"★".repeat(c.estrellas)}${"☆".repeat(5 - c.estrellas)}</div>
      <p>"${c.texto}"</p>
      <div class="testi-name">${c.nombre}</div>
      <div class="testi-role">${c.destino} · ${c.experiencia}</div>
    </div>`).join("");
}
