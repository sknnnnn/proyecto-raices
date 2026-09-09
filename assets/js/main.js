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
   - Por destino: destinos.html → catalogo.html?destino=slug
     (catalogo.html no tiene tipo fijo: mezcla tours, travesías
     y paquetes de ese destino, con chips para filtrar por tipo).

   Cada función de render sólo actúa si encuentra en la página
   el contenedor que le corresponde, así este único archivo
   sirve para todo el sitio.
   ========================================================= */

/* Configuración del sitio (antes SITE_CONFIG de site-config.js), ahora
   poblada desde Supabase (tabla site_config) vía DataAPI. La consulta
   arranca apenas carga este script (no espera a DOMContentLoaded), y
   "siteConfigReady" es la promesa que cualquier script de página debe
   esperar antes de llamar whatsappLink()/mailtoLink() o leer
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
  const texto = encodeURIComponent(mensaje || "Hola, quiero consultar por una experiencia de Proyecto Raíces.");
  return `https://wa.me/${SITE_CONFIG.whatsapp}?text=${texto}`;
}

function mailtoLink(asunto){
  const subject = encodeURIComponent(asunto || "Consulta desde la web");
  return `mailto:${SITE_CONFIG.email}?subject=${subject}`;
}

document.addEventListener("DOMContentLoaded", async () => {
  initNav();
  initHeaderScroll();
  initFooterYear();
  initLightbox();

  await siteConfigReady;
  initWhatsappFloat();
  initContactForm();
  initFooterContacto();

  renderPropuestasGrid();   // async — consulta Supabase vía DataAPI
  renderPropuestaDetalle(); // async — consulta Supabase vía DataAPI
  renderDestinosGrid();
  renderEquipoGrid(); // async — sólo actúa si la página tiene #equipo-grid o #equipo-mini-grid
  initTestimoniosCarousel(); // sólo actúa si la página tiene #testi-track (Inicio)
  initComentariosGrid(); // sólo actúa si la página tiene #comentarios-grid (comentarios.html)
  initGaleriaJustify(); // sólo actúa si la página tiene .gal-row (galeria.html)
});

/* Metadata de presentación por tipo de producto (label/plural/página de
   listado). No es un dato de negocio de una experiencia puntual — es
   configuración de UI fija, así que vive acá en vez de en Supabase o en
   propuestas-data.js. "tipoProducto" en Supabase es la fuente de verdad
   de qué tipo es cada experiencia; esto sólo mapea ese valor a texto.
   Definido de forma condicional porque, durante la transición, algunas
   páginas todavía cargan propuestas-data.js (que declara lo mismo con
   "const" a nivel de script) — declararlo acá también con "const"
   rompería esas páginas con un error de identificador duplicado. */
if (typeof TIPOS_PROPUESTA === "undefined") {
  window.TIPOS_PROPUESTA = {
    tour:     { label: "Tour",     labelPlural: "Tours",      pagina: "tours.html" },
    travesia: { label: "Travesía", labelPlural: "Travesías",  pagina: "travesias.html" },
    paquete:  { label: "Paquete",  labelPlural: "Paquetes",   pagina: "paquetes.html" }
  };
}

/* ---------- Header sólido al scrollear ----------
   En Inicio/Guías/Comentarios el header nace transparente sobre la
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
  // Acepta tanto el shape nuevo (Supabase, campo "tipoProducto") como el
  // viejo (PROPUESTAS, campo "tipo") — útil mientras conviven páginas
  // migradas y no migradas en la misma transición.
  const grupos = {};
  const orden = [];
  lista.forEach(p => {
    const tipo = p.tipoProducto || p.tipo;
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

  // Marca el link activo según data-page en <body>
  const page = document.body.getAttribute("data-page");
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
  holder.innerHTML = `<a class="whatsapp-float" href="${link}" target="_blank" rel="noopener" aria-label="Escribinos por WhatsApp">💬</a>`;
}

/* ---------- Formulario de contacto ----------
   No hay backend ni servicio de envío (Google Forms/Formspree/EmailJS):
   el submit arma un mailto: con los datos ya cargados y redirige el
   navegador ahí, así que lo único que "envía" la consulta es que la
   persona confirme el envío desde su propio cliente de correo. El
   mensaje de status refleja eso — no promete una respuesta que todavía
   no depende de nosotros, sino de ese paso final del usuario. */
function initContactForm(){
  const form = document.getElementById("contact-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const status = document.getElementById("form-status");
    const nombre = form.nombre.value;
    const email = form.email.value;
    const destino = form.destino.value;
    const mensaje = form.mensaje.value;
    const cuerpo = encodeURIComponent(
      `Nombre: ${nombre}\nEmail: ${email}\nDestino de interés: ${destino}\n\nMensaje:\n${mensaje}`
    );
    if (status) {
      status.textContent = "Se abrió tu correo con la consulta ya redactada — confirmá el envío desde ahí para que nos llegue.";
      status.classList.add("show", "ok");
    }
    window.location.href = `mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent("Consulta desde la web — " + nombre)}&body=${cuerpo}`;
    form.reset();
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
   (con body[data-tipo-fijo]) y catalogo.html (sin tipo fijo,
   filtrado por destino, con chips de tipo).
   ========================================================= */
async function renderPropuestasGrid(){
  const grid = document.getElementById("prop-grid");
  if (!grid) return;

  const tipoFijo = document.body.getAttribute("data-tipo-fijo"); // "tour" | "travesia" | "paquete" | null
  const params = new URLSearchParams(window.location.search);
  const destinoFiltro = params.get("destino");
  const tipoFiltro = tipoFijo || params.get("tipo");

  // Contexto explícito (PRO-48) que cada card agrega a su link hacia
  // propuesta.html, para que el botón "← Volver a…" del detalle no
  // dependa de document.referrer. tours.html/travesias.html/paquetes.html
  // (data-tipo-fijo) mandan su propio tipo; catalogo.html sólo manda
  // contexto cuando llegó con un ?origen= válido (experiencias/destinos)
  // — un acceso directo a catalogo.html no genera ese origen, así que sus
  // cards quedan sin contexto, igual que antes.
  let volverCtx = "";
  if (tipoFijo && TIPOS_PROPUESTA[tipoFijo]) {
    const origenTipo = TIPOS_PROPUESTA[tipoFijo].pagina.replace(/\.html$/, "");
    volverCtx = `&origen=${origenTipo}${destinoFiltro ? `&destino=${encodeURIComponent(destinoFiltro)}` : ""}`;
  } else if (!tipoFijo && destinoFiltro) {
    const origenCat = params.get("origen");
    if (origenCat === "experiencias" || origenCat === "destinos") {
      volverCtx = `&origen=${origenCat}&destino=${encodeURIComponent(destinoFiltro)}`;
    }
  }

  grid.innerHTML = `<div class="empty-state">Cargando…</div>`;

  let destinos, lista;
  try {
    [destinos, lista] = await Promise.all([
      DataAPI.getDestinosActivos(),
      DataAPI.getExperienciasPublicadas({ tipo: tipoFiltro || undefined, destinoSlug: destinoFiltro || undefined })
    ]);
  } catch (err) {
    console.error("Error cargando experiencias:", err);
    grid.innerHTML = `<div class="empty-state">No pudimos cargar las experiencias en este momento. Probá recargar la página.</div>`;
    return;
  }

  // ---- Chips de filtro ----
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
      const paises = [...new Set(destinos.map(d => d.pais))];
      let optionsHtml = `<option value="">Todos los destinos</option>`;
      paises.forEach(pais => {
        optionsHtml += `<optgroup label="${pais}">`;
        destinos.filter(d => d.pais === pais && d.disponible).forEach(d => {
          optionsHtml += `<option value="${d.slug}"${destinoFiltro === d.slug ? " selected" : ""}>${d.nombre}</option>`;
        });
        optionsHtml += `</optgroup>`;
      });
      filtrosWrap.innerHTML = `
        <div class="filtro-destino-group">
          <label class="filtro-destino-label" for="prop-destino-select">Destino</label>
          <select class="filtro-destino-select" id="prop-destino-select">${optionsHtml}</select>
        </div>`;
      const select = document.getElementById("prop-destino-select");
      select.addEventListener("change", () => {
        const slug = select.value;
        const p = new URLSearchParams(window.location.search);
        if (slug) p.set("destino", slug); else p.delete("destino");
        aplicarFiltroSuave(p);
      });
    } else {
      // catalogo.html (explorando por destino): los chips filtran por tipo.
      let html = `<button class="filtro-btn ${!tipoFiltro ? "active" : ""}" data-tipo="">Todos</button>`;
      Object.keys(TIPOS_PROPUESTA).forEach(key => {
        html += `<button class="filtro-btn ${tipoFiltro === key ? "active" : ""}" data-tipo="${key}">${TIPOS_PROPUESTA[key].labelPlural}</button>`;
      });
      filtrosWrap.innerHTML = html;
      filtrosWrap.querySelectorAll(".filtro-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const tipo = btn.getAttribute("data-tipo");
          const p = new URLSearchParams(window.location.search);
          if (tipo) p.set("tipo", tipo); else p.delete("tipo");
          if (destinoFiltro) p.set("destino", destinoFiltro);
          aplicarFiltroSuave(p);
        });
      });
    }
  }

  // "Todos" (sin tipo fijo ni filtro de tipo): mezcla Tours/Travesías/
  // Paquetes entre sí en vez de mostrarlos agrupados en bloques. Con un
  // único tipo ya filtrado esto no cambia nada (round-robin de 1 grupo).
  // (El filtro por tipo/destino ya se aplicó del lado de DataAPI.)
  lista = interleaveByTipo(lista);

  // ---- Aviso de filtro activo (sólo relevante en catalogo.html) ----
  const tituloFiltro = document.getElementById("prop-filtro-activo");
  if (tituloFiltro) {
    if (destinoFiltro && !tipoFijo) {
      const d = destinos.find(d => d.slug === destinoFiltro);
      tituloFiltro.innerHTML = `Mostrando propuestas en <b>${d ? d.nombre : destinoFiltro}</b> · <a href="destinos.html">ver todos los destinos</a>`;
      tituloFiltro.style.display = "block";
    } else {
      tituloFiltro.style.display = "none";
    }
  }

  if (lista.length === 0) {
    grid.innerHTML = `<div class="empty-state">Todavía no hay propuestas cargadas para este filtro.<br>Muy pronto vamos a sumar más salidas.</div>`;
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

function propuestaCardHtml(p, volverCtx){
  const tipoInfo = TIPOS_PROPUESTA[p.tipoProducto];
  const href = `propuesta.html?id=${p.slug}${volverCtx || ""}`;
  return `
    <article class="exp-card" data-tipo="${p.tipoProducto}">
      <a class="img-wrap" href="${href}" aria-label="Ver detalles de ${p.nombre}">
        ${p.imagen ? `<img src="${p.imagen}" alt="${p.nombre}" loading="lazy"${p.imagenPos ? ` style="object-position:${p.imagenPos};"` : ""}>` : `<div class="gal-placeholder" style="height:100%;">Imagen pendiente</div>`}
        <span class="cat-badge">${tipoInfo ? tipoInfo.label : p.tipoProducto}</span>
      </a>
      <div class="body">
        ${p.esPlaceholder ? `<span class="placeholder-badge">Contenido de ejemplo</span>` : ""}
        <span class="dest-tag">${p.destino ? p.destino.nombre : ""}</span>
        <h3>${p.nombre}</h3>
        <p class="resumen">${p.resumen}</p>
        <div class="meta">
          <span>⏱ ${p.duracion}</span>
          <span>👥 ${p.modalidad}</span>
          ${p.precio ? `<span>💲 ${p.precio}</span>` : ""}
        </div>
        <div class="actions">
          <a class="btn btn-sm" href="${href}">Ver detalles</a>
          <a class="btn btn-outline on-light btn-sm" href="contacto.html?propuesta=${encodeURIComponent(p.nombre)}">Consultar</a>
        </div>
      </div>
    </article>`;
}

/* ---------- Navegación contextual "← Volver a…" (PRO-48) ----------
   Botón discreto y secundario, complementario al breadcrumb (no lo
   reemplaza). Determinista: nunca usa history.back(), sólo enlaces
   internos ya resueltos por quien la llama (catalogo.html según
   ?origen=, o renderPropuestaDetalle según el mismo contexto que arma
   el breadcrumb). Sin contexto válido (href/label null), el link queda
   oculto — no aparece "Volver" en accesos directos. */
function setVolverLink(id, href, label){
  const el = document.getElementById(id);
  if (!el) return;
  if (!href || !label) { el.style.display = "none"; return; }
  el.href = href;
  el.textContent = `← Volver a ${label}`;
  el.style.display = "inline-block";
}

/* =========================================================
   DETALLE DE PROPUESTA (propuesta.html)
   La ficha lee "tipo" y arma automáticamente los bloques
   específicos a partir de "detalle" (ver propuestas-data.js).
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
      No encontramos esa propuesta.<br>
      <a class="btn btn-sm" style="margin-top:16px;" href="destinos.html">Volver a Destinos</a>
    </div>`;

  let p;
  try {
    p = id ? await DataAPI.getExperienciaPorSlug(id) : null;
  } catch (err) {
    console.error("Error cargando la propuesta:", err);
    cont.innerHTML = `<div class="empty-state">No pudimos cargar esta propuesta en este momento. Probá recargar la página.</div>`;
    return;
  }

  // Una propuesta no publicada se trata igual que una inexistente: no
  // debe poder verse por más que alguien conozca o adivine su id/URL.
  if (!p || !p.publicado) {
    cont.innerHTML = notFoundHtml;
    document.title = "Propuesta no encontrada — Proyecto Raíces";
    return;
  }

  const tipoInfo = TIPOS_PROPUESTA[p.tipoProducto];
  document.title = `${p.nombre} — Proyecto Raíces`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", p.resumen);

  const destino = p.destino;
  let galeriaRows = [];
  try {
    galeriaRows = await DataAPI.getGaleria(p.id);
  } catch (err) {
    console.error("Error cargando la galería:", err);
  }
  const galeria = galeriaRows.length ? galeriaRows.map(g => g.url) : (p.imagen ? [p.imagen] : []);
  const principal = galeria[0] || null;

  const bcEl = document.getElementById("exp-breadcrumb");
  if (bcEl) {
    let volverHref = tipoInfo ? tipoInfo.pagina : "destinos.html";
    let volverLabel = tipoInfo ? tipoInfo.labelPlural : "Propuestas";
    // Nivel intermedio opcional "Experiencias /", sólo cuando se llegó
    // por el explorador país→destino de experiencias.html (ver más abajo).
    let experienciasCrumb = "";
    // Sólo true cuando el referrer coincidió con un contexto interno
    // real (catálogo por destino, o la propia página de tipo fijo con
    // filtro) — no con el fallback por defecto. El botón "← Volver a…"
    // (PRO-48) reutiliza exactamente este mismo destino/label; en un
    // acceso directo (sin ese contexto) el botón no debe mostrarse.
    let tieneContexto = false;
    // Contexto explícito por query params (PRO-48): ya no depende de
    // document.referrer. Las cards que llevan a propuesta.html (ver
    // propuestaCardHtml en este mismo archivo) agregan "?origen=" y,
    // cuando corresponde, "&destino=" — mismo mecanismo que catalogo.html
    // ya usa para su propio botón "← Volver a…".
    const origen = params.get("origen"); // "experiencias" | "destinos" | "tours" | "travesias" | "paquetes" | null
    const destinoCtxSlug = params.get("destino");
    try {
      if ((origen === "experiencias" || origen === "destinos") && destinoCtxSlug) {
        const refDestino = await DataAPI.getDestinoPorSlug(destinoCtxSlug);
        volverHref = `catalogo.html?destino=${encodeURIComponent(destinoCtxSlug)}&origen=${origen}`;
        volverLabel = refDestino ? refDestino.nombre : "Catálogo";
        tieneContexto = true;
        // Nivel intermedio "Experiencias /" sólo cuando se llegó por el
        // explorador país→destino de experiencias.html.
        if (origen === "experiencias") {
          experienciasCrumb = `<a href="experiencias.html">Experiencias</a> / `;
        }
      } else if (tipoInfo && origen === tipoInfo.pagina.replace(/\.html$/, "")) {
        // Contexto válido con o sin filtro de destino — si no había
        // ?destino=, volverHref no cambia (ya apuntaba a tipoInfo.pagina
        // por defecto).
        volverHref = tipoInfo.pagina + (destinoCtxSlug ? `?destino=${encodeURIComponent(destinoCtxSlug)}` : "");
        tieneContexto = true;
      }
    } catch (e) { /* sin contexto válido: se usa el destino por defecto */ }
    bcEl.innerHTML = `<a href="index.html">Inicio</a> / ${experienciasCrumb}<a href="${volverHref}">${volverLabel}</a> / ${p.nombre}`;
    setVolverLink("prop-volver", tieneContexto ? volverHref : null, tieneContexto ? volverLabel : null);
  }

  const consultaHref = `contacto.html?propuesta=${encodeURIComponent(p.nombre)}`;
  // Tours y Travesías: el CTA principal va directo a WhatsApp con el
  // nombre de la propuesta precargado (whatsappLink ya arma la URL con
  // el mensaje codificado).
  const tourWaHref = p.tipoProducto === "tour" && typeof whatsappLink === "function"
    ? whatsappLink(`Hola, quiero consultar por el Tour "${p.nombre}".`)
    : null;
  const travesiaWaHref = p.tipoProducto === "travesia" && typeof whatsappLink === "function"
    ? whatsappLink(`Hola, quiero consultar por la Travesía "${p.nombre}".`)
    : null;

  // Bloques específicos según el tipo (leídos de p.detalle + relaciones)
  const especifico = await renderDetalleEspecifico(p);

  cont.innerHTML = `
    ${p.esPlaceholder ? `<div class="notice-box">⚠️ Esta es una propuesta de ejemplo, incluida sólo para mostrar cómo funciona la ficha de detalle. Reemplazá este contenido por el real antes de publicar.</div>` : ""}
    <div class="exp-detail-grid" style="margin-top:28px;">
      <div>
        <div class="exp-gallery-main">
          ${principal ? `<img src="${principal}" alt="${p.nombre}" id="exp-main-img"${p.imagenPos ? ` style="object-position:${p.imagenPos};"` : ""}>` : `<div class="gal-placeholder" style="height:100%;">Imagen pendiente</div>`}
        </div>
        ${galeria.length > 1 ? `
        <div class="exp-gallery-thumbs">
          ${galeria.map(src => `<img src="${src}" alt="${p.nombre}" style="cursor:pointer;" onclick="document.getElementById('exp-main-img').src='${src}'">`).join("")}
        </div>` : ""}

        <div class="exp-body">
          <h2 class="mt-0">Descripción</h2>
          <p>${p.descripcion}</p>

          ${especifico.bodyHtml}

          ${p.tipoProducto === "tour" || p.tipoProducto === "travesia" ? `<div class="notice-box">Esta ${p.tipoProducto === "tour" ? "salida" : "travesía"} puede reservarse de forma privada, sólo para tu grupo, sujeto a disponibilidad.</div>` : ""}
          ${p.tipoProducto === "paquete" ? `<div class="notice-box">El itinerario puede conversarse y adaptarse según las necesidades del grupo, cuando resulte viable.</div>` : ""}

          ${p.incluye && p.incluye.length ? `<h2>Qué incluye</h2><ul class="check-list">${p.incluye.map(i => `<li>${i}</li>`).join("")}</ul>` : ""}

          ${p.noIncluye && p.noIncluye.length ? `<h2>Qué no incluye</h2><ul class="cross-list">${p.noIncluye.map(i => `<li>${i}</li>`).join("")}</ul>` : ""}

          ${p.infoImportante ? `<h2>Información importante</h2><p>${p.infoImportante}</p>` : ""}
        </div>
      </div>

      <aside class="exp-info-card">
        <span class="dest-tag">${tipoInfo ? tipoInfo.label : p.tipoProducto}</span>
        <h1 style="margin-top:8px;">${p.nombre}</h1>
        ${especifico.badgeHtml}
        <div class="info-row"><span>Destino</span><b>${destino ? destino.nombre : ""}</b></div>
        <div class="info-row"><span>Ubicación</span><b>${p.ubicacion}</b></div>
        <div class="info-row"><span>Duración</span><b>${p.duracion}</b></div>
        <div class="info-row"><span>Modalidad</span><b>${p.modalidad}</b></div>
        ${p.precio ? `<div class="info-row"><span>Precio</span><b>${p.precio}</b></div>` : ""}
        ${especifico.asideHtml}
        ${p.tipoProducto === "tour"
          ? `<a class="btn" href="${tourWaHref || consultaHref}"${tourWaHref ? ` target="_blank" rel="noopener"` : ""}>Consultar este Tour</a>`
          : p.tipoProducto === "travesia"
          ? `<a class="btn" href="${travesiaWaHref || consultaHref}"${travesiaWaHref ? ` target="_blank" rel="noopener"` : ""}>Consultar esta Travesía</a>`
          : `<a class="btn" href="${consultaHref}">Consultar disponibilidad</a>
        <a class="btn btn-outline on-light btn-block" style="margin-top:10px;" href="${consultaHref}">Solicitar información</a>`}
      </aside>
    </div>
  `;
}

/* ---- Router: elige el helper según p.tipoProducto ---- */
async function renderDetalleEspecifico(p){
  const vacio = { bodyHtml: "", asideHtml: "", badgeHtml: "" };
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
  const dias = itinerario.map(d => `<li><b>Día ${d.dia}${d.titulo ? " — " + d.titulo : ""}</b>${d.descripcion ? `<br>${d.descripcion}` : ""}</li>`).join("");
  return `<h2>Itinerario</h2><ul class="check-list">${dias}</ul>`;
}

function personalizableBadge(esPersonalizable){
  if (!esPersonalizable) return "";
  return `<div class="placeholder-badge" style="background:var(--celeste); color:#fff; margin-bottom:14px;">Personalizable</div>`;
}

/* ---- TOUR: actividad de un día ---- */
function renderDetalleTour(d){
  let bodyHtml = "";
  if (d.combinableConOtrosTours) {
    bodyHtml += `<div class="notice-box">Este tour se puede combinar con otros tours.${d.seConvierteEnTravesiaAlCombinar ? " Al combinarlo, la salida se convierte en una travesía de varios días." : ""}</div>`;
  }
  bodyHtml += listaSiHay("Recorrido", d.recorrido, "check-list");
  bodyHtml += itinerarioSiHay(d.itinerarioCombinado);

  // Ficha técnica uniforme: los 29 Tours muestran siempre estos 4 campos,
  // en el mismo orden — cuando un dato no está disponible en la info
  // original, se usa "Consultar" en vez de ocultar la fila o inventar un valor.
  let asideHtml = "";
  asideHtml += infoRowSiHay("Distancia", d.distancia || "Consultar");
  asideHtml += infoRowSiHay("Salida", d.salida || "Consultar");
  asideHtml += infoRowSiHay("Regreso", d.regreso || "Consultar");
  asideHtml += infoRowSiHay("Punto de encuentro", d.puntoDeEncuentro || "Consultar");
  if (d.seConvierteEnTravesiaAlCombinar) {
    asideHtml += infoRowSiHay("Duración combinada", d.duracionCombinada);
  }

  return { bodyHtml, asideHtml, badgeHtml: "" };
}

/* ---- TRAVESÍA: varios días, personalizable ---- */
function renderDetalleTravesia(d){
  let bodyHtml = "";
  bodyHtml += itinerarioSiHay(d.itinerario);
  bodyHtml += listaSiHay("Qué no cubre la logística", d.logisticaNoIncluida, "cross-list");

  // Ficha rápida uniforme: las 11 Travesías muestran siempre estos 4
  // campos, en el mismo orden — cuando un dato no está confirmado en la
  // fuente, se usa "Consultar" en vez de ocultar la fila o inventar un valor.
  let asideHtml = "";
  asideHtml += infoRowSiHay("Distancia", d.distanciaTotal || "Consultar");
  asideHtml += infoRowSiHay("Dificultad", d.dificultad || "Consultar");
  asideHtml += infoRowSiHay("Alojamiento", d.alojamiento || "Consultar");
  // d.fechasNota es una aclaración corta y discreta (ej. "A confirmar")
  // que va debajo de la fecha, separada del dato principal.
  const fechasValor = (d.fechas && d.fechas.length) ? d.fechas.join(" · ") : "Consultar";
  const fechasNotaHtml = d.fechasNota ? `<small class="nota">${d.fechasNota}</small>` : "";
  asideHtml += `<div class="info-row"><span>Fechas</span><b>${fechasValor}${fechasNotaHtml}</b></div>`;

  return { bodyHtml, asideHtml, badgeHtml: personalizableBadge(d.personalizable) };
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
  bodyHtml += listaSiHay("Actividades incluidas", actividadesIncluidas, "check-list");

  const toursLinkeados = incluidas.filter(e => e.tipoProducto === "tour");
  const travesiasLinkeadas = incluidas.filter(e => e.tipoProducto === "travesia");
  if (toursLinkeados.length) {
    bodyHtml += `<h2>Tours incluidos en este paquete</h2><ul class="check-list">${toursLinkeados.map(t => `<li><a href="propuesta.html?id=${t.slug}">${t.nombre}</a></li>`).join("")}</ul>`;
  }
  if (travesiasLinkeadas.length) {
    bodyHtml += `<h2>Travesías incluidas en este paquete</h2><ul class="check-list">${travesiasLinkeadas.map(t => `<li><a href="propuesta.html?id=${t.slug}">${t.nombre}</a></li>`).join("")}</ul>`;
  }

  let asideHtml = "";
  asideHtml += infoRowSiHay("Transporte", d.transporte);
  asideHtml += infoRowSiHay("Vuelos", d.vuelos);
  asideHtml += infoRowSiHay("Traslados", d.traslados);
  asideHtml += infoRowSiHay("Alojamiento", d.alojamiento);
  asideHtml += infoRowSiHay("Comidas", d.comidas);

  return { bodyHtml, asideHtml, badgeHtml: personalizableBadge(d.personalizable) };
}

/* =========================================================
   GRILLA DE DESTINOS (destinos.html + home)
   Cada destino enlaza a catalogo.html?destino=slug, que
   mezcla tours, travesías y paquetes de ese lugar.
   ========================================================= */
function renderDestinosGrid(){
  const argCont = document.getElementById("destinos-argentina");
  const intCont = document.getElementById("destinos-internacional");
  if ((!argCont && !intCont) || typeof DESTINOS === "undefined") return;

  const cardHtml = (d) => {
    const cantidad = typeof PROPUESTAS !== "undefined" ? getPropuestasPorDestino(d.slug).length : 0;
    return `
    <a class="dest-card ${d.esPlaceholder ? "placeholder" : ""}" href="catalogo.html?destino=${d.slug}">
      ${d.imagen ? `<img src="${d.imagen}" alt="${d.nombre}">` : ""}
      <div class="info">
        <span class="tag">${d.pais}</span>
        <h3>${d.nombre}</h3>
        <p>${d.resumen}</p>
        ${d.esPlaceholder ? `<span class="placeholder-flag">Contenido en preparación</span>` : `<span class="count">${cantidad} propuesta${cantidad === 1 ? "" : "s"} →</span>`}
      </div>
    </a>`;
  };

  if (argCont) {
    argCont.innerHTML = DESTINOS.filter(d => d.grupo === "argentina").map(cardHtml).join("");
  }
  if (intCont) {
    intCont.innerHTML = DESTINOS.filter(d => d.grupo === "internacional").map(cardHtml).join("");
  }
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
    contenedores.forEach(c => { c.el.innerHTML = `<p class="empty-state">No pudimos cargar esta información en este momento.</p>`; });
    return;
  }

  const personaHtml = (m, prefix) => `
    <figure class="${prefix}-persona">
      <div class="${prefix}-foto"><img src="${m.imagen}" alt="${m.nombre}, parte del equipo de Proyecto Raíces"${m.imagenPos ? ` style="object-position:${m.imagenPos};"` : ""} loading="lazy"></div>
      <figcaption>
        <h3>${m.nombre}</h3>
        ${m.rol ? `<p>${m.rol}</p>` : ""}
      </figcaption>
    </figure>`;

  contenedores.forEach(c => {
    c.el.innerHTML = equipo.length
      ? equipo.map(m => personaHtml(m, c.prefix)).join("")
      : `<p class="empty-state">Todavía no hay integrantes cargados.</p>`;
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
    <li class="testi-slide${i === 0 ? " is-active" : ""}" role="group" aria-roledescription="comentario" aria-label="${i + 1} de ${comentarios.length}"${i === 0 ? "" : " aria-hidden=\"true\""}>
      <div class="testi-card">
        <div class="stars" aria-hidden="true">${"★".repeat(c.estrellas)}${"☆".repeat(5 - c.estrellas)}</div>
        <p>"${c.texto}"</p>
        <div class="testi-name">${c.nombre}</div>
        <div class="testi-role">${c.destino} · ${c.experiencia}</div>
      </div>
    </li>`).join("");

  dotsWrap.innerHTML = comentarios.map((_, i) => `
    <button type="button" class="testi-dot${i === 0 ? " is-active" : ""}" aria-label="Ir al comentario ${i + 1} de ${comentarios.length}" aria-current="${i === 0 ? "true" : "false"}"></button>`).join("");

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
    grid.innerHTML = `<p class="empty-state" style="grid-column:1/-1;">Todavía no tenemos reseñas publicadas. Muy pronto vamos a sumar acá las experiencias reales de quienes viajen con nosotros.</p>`;
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
