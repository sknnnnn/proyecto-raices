/* =========================================================
   PROYECTO RAÍCES — main.js
   Lógica compartida por todas las páginas: menú mobile,
   año del footer, botón de WhatsApp, formulario de contacto,
   lightbox de galería, y el armado dinámico de las páginas
   que se alimentan de los archivos de datos
   (propuestas-data.js, destinos-data.js).

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

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initFooterYear();
  initWhatsappFloat();
  initContactForm();
  initLightbox();

  renderPropuestasGrid();
  renderPropuestaDetalle();
  renderDestinosGrid();
  initTestimoniosCarousel(); // sólo actúa si la página tiene #testi-track (Inicio)
  initGaleriaJustify(); // sólo actúa si la página tiene .gal-row (galeria.html)
});

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

/* ---------- Botón flotante de WhatsApp ---------- */
function initWhatsappFloat(){
  const holder = document.getElementById("whatsapp-float-holder");
  if (!holder) return;
  const link = whatsappLink();
  if (!link) return; // sin número cargado todavía: no se muestra nada
  holder.innerHTML = `<a class="whatsapp-float" href="${link}" target="_blank" rel="noopener" aria-label="Escribinos por WhatsApp">💬</a>`;
}

/* ---------- Formulario de contacto ---------- */
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
      status.textContent = "¡Gracias! Te vamos a responder a la brevedad. También se abrió tu correo para enviar la consulta directamente.";
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
function renderPropuestasGrid(){
  const grid = document.getElementById("prop-grid");
  if (!grid || typeof PROPUESTAS === "undefined") return;

  const tipoFijo = document.body.getAttribute("data-tipo-fijo"); // "tour" | "travesia" | "paquete" | null
  const params = new URLSearchParams(window.location.search);
  const destinoFiltro = params.get("destino");
  const tipoFiltro = tipoFijo || params.get("tipo");

  // ---- Chips de filtro ----
  const filtrosWrap = document.getElementById("prop-filtros");
  if (filtrosWrap) {
    if (tipoFijo) {
      // Dentro de una página de tipo fijo (Tours/Travesías/Paquetes):
      // los chips filtran por destino.
      const base = getPropuestasPorTipo(tipoFijo);
      const destinosDisponibles = [...new Set(base.map(p => p.destino))]
        .map(slug => getDestinoPorSlug(slug)).filter(Boolean);
      let html = `<button class="filtro-btn ${!destinoFiltro ? "active" : ""}" data-destino="">Todos los destinos</button>`;
      destinosDisponibles.forEach(d => {
        html += `<button class="filtro-btn ${destinoFiltro === d.slug ? "active" : ""}" data-destino="${d.slug}">${d.nombre}</button>`;
      });
      filtrosWrap.innerHTML = html;
      filtrosWrap.querySelectorAll(".filtro-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const slug = btn.getAttribute("data-destino");
          const p = new URLSearchParams(window.location.search);
          if (slug) p.set("destino", slug); else p.delete("destino");
          aplicarFiltroSuave(p);
        });
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

  // ---- Lista filtrada ----
  let lista = PROPUESTAS.slice();
  if (tipoFiltro) lista = lista.filter(p => p.tipo === tipoFiltro);
  if (destinoFiltro) lista = lista.filter(p => p.destino === destinoFiltro);

  // ---- Aviso de filtro activo (sólo relevante en catalogo.html) ----
  const tituloFiltro = document.getElementById("prop-filtro-activo");
  if (tituloFiltro) {
    if (destinoFiltro && !tipoFijo) {
      const d = getDestinoPorSlug(destinoFiltro);
      tituloFiltro.innerHTML = `Mostrando propuestas en <b>${d ? d.nombre : destinoFiltro}</b> · <a href="destinos.html">ver todos los destinos</a>`;
      tituloFiltro.style.display = "block";
    } else {
      tituloFiltro.style.display = "none";
    }
  }

  if (lista.length === 0) {
    grid.innerHTML = `<div class="empty-state">Todavía no hay propuestas cargadas para este filtro.<br>Muy pronto vamos a sumar más salidas.</div>`;
  } else {
    grid.innerHTML = lista.map(p => propuestaCardHtml(p)).join("");
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

function propuestaCardHtml(p){
  const destino = getDestinoPorSlug(p.destino);
  const tipoInfo = TIPOS_PROPUESTA[p.tipo];
  return `
    <article class="exp-card" data-tipo="${p.tipo}">
      <div class="img-wrap">
        ${p.imagen ? `<img src="${p.imagen}" alt="${p.nombre}" loading="lazy">` : `<div class="gal-placeholder" style="height:100%;">Imagen pendiente</div>`}
        <span class="cat-badge">${tipoInfo ? tipoInfo.label : p.tipo}</span>
      </div>
      <div class="body">
        ${p.esPlaceholder ? `<span class="placeholder-badge">Contenido de ejemplo</span>` : ""}
        <span class="dest-tag">${destino ? destino.nombre : p.destino}</span>
        <h3>${p.nombre}</h3>
        <p class="resumen">${p.resumen}</p>
        <div class="meta">
          <span>⏱ ${p.duracion}</span>
          <span>👥 ${p.modalidad}</span>
          ${p.precio ? `<span>💲 ${p.precio}</span>` : ""}
        </div>
        <div class="actions">
          <a class="btn btn-sm" href="propuesta.html?id=${p.id}">Ver detalles</a>
          <a class="btn btn-outline on-light btn-sm" href="contacto.html?propuesta=${encodeURIComponent(p.nombre)}">Consultar</a>
        </div>
      </div>
    </article>`;
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
function renderPropuestaDetalle(){
  const cont = document.getElementById("prop-detalle");
  if (!cont || typeof PROPUESTAS === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const p = getPropuestaPorId(id);

  if (!p) {
    cont.innerHTML = `
      <div class="empty-state">
        No encontramos esa propuesta.<br>
        <a class="btn btn-sm" style="margin-top:16px;" href="destinos.html">Volver a Destinos</a>
      </div>`;
    document.title = "Propuesta no encontrada — Proyecto Raíces";
    return;
  }

  const tipoInfo = TIPOS_PROPUESTA[p.tipo];
  document.title = `${p.nombre} — Proyecto Raíces`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", p.resumen);

  const destino = getDestinoPorSlug(p.destino);
  const galeria = p.galeria && p.galeria.length ? p.galeria : (p.imagen ? [p.imagen] : []);
  const principal = galeria[0] || null;

  const bcEl = document.getElementById("exp-breadcrumb");
  if (bcEl) {
    const paginaTipo = tipoInfo ? tipoInfo.pagina : "destinos.html";
    const labelTipo = tipoInfo ? tipoInfo.labelPlural : "Propuestas";
    bcEl.innerHTML = `<a href="index.html">Inicio</a> / <a href="${paginaTipo}">${labelTipo}</a> / ${p.nombre}`;
  }

  const consultaHref = `contacto.html?propuesta=${encodeURIComponent(p.nombre)}`;

  // Bloques específicos según el tipo (leídos de p.detalle)
  const especifico = renderDetalleEspecifico(p);

  cont.innerHTML = `
    ${p.esPlaceholder ? `<div class="notice-box">⚠️ Esta es una propuesta de ejemplo, incluida sólo para mostrar cómo funciona la ficha de detalle. Reemplazá este contenido por el real antes de publicar.</div>` : ""}
    <div class="exp-detail-grid" style="margin-top:28px;">
      <div>
        <div class="exp-gallery-main">
          ${principal ? `<img src="${principal}" alt="${p.nombre}" id="exp-main-img">` : `<div class="gal-placeholder" style="height:100%;">Imagen pendiente</div>`}
        </div>
        ${galeria.length > 1 ? `
        <div class="exp-gallery-thumbs">
          ${galeria.map(src => `<img src="${src}" alt="${p.nombre}" style="cursor:pointer;" onclick="document.getElementById('exp-main-img').src='${src}'">`).join("")}
        </div>` : ""}

        <div class="exp-body">
          <h2 class="mt-0">Descripción</h2>
          <p>${p.descripcion}</p>

          ${especifico.bodyHtml}

          ${p.incluye && p.incluye.length ? `<h2>Qué incluye</h2><ul class="check-list">${p.incluye.map(i => `<li>${i}</li>`).join("")}</ul>` : ""}

          ${p.noIncluye && p.noIncluye.length ? `<h2>Qué no incluye</h2><ul class="cross-list">${p.noIncluye.map(i => `<li>${i}</li>`).join("")}</ul>` : ""}

          ${p.infoImportante ? `<h2>Información importante</h2><p>${p.infoImportante}</p>` : ""}
        </div>
      </div>

      <aside class="exp-info-card">
        <span class="dest-tag">${tipoInfo ? tipoInfo.label : p.tipo} · ${p.categoria}</span>
        <h1 style="margin-top:8px;">${p.nombre}</h1>
        ${especifico.badgeHtml}
        <div class="info-row"><span>Destino</span><b>${destino ? destino.nombre : p.destino}</b></div>
        <div class="info-row"><span>Ubicación</span><b>${p.ubicacion}</b></div>
        <div class="info-row"><span>Duración</span><b>${p.duracion}</b></div>
        <div class="info-row"><span>Modalidad</span><b>${p.modalidad}</b></div>
        ${p.precio ? `<div class="info-row"><span>Precio</span><b>${p.precio}</b></div>` : ""}
        ${especifico.asideHtml}
        <a class="btn" href="${consultaHref}">Consultar disponibilidad</a>
        <a class="btn btn-outline on-light btn-block" style="margin-top:10px;" href="${consultaHref}">Solicitar información</a>
      </aside>
    </div>
  `;
}

/* ---- Router: elige el helper según p.tipo ---- */
function renderDetalleEspecifico(p){
  const vacio = { bodyHtml: "", asideHtml: "", badgeHtml: "" };
  if (!p.detalle) return vacio;
  if (p.tipo === "tour") return renderDetalleTour(p.detalle);
  if (p.tipo === "travesia") return renderDetalleTravesia(p.detalle);
  if (p.tipo === "paquete") return renderDetallePaquete(p.detalle);
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

  let asideHtml = "";
  asideHtml += infoRowSiHay("Fecha", d.fecha);
  asideHtml += infoRowSiHay("Horario", d.horario);
  asideHtml += infoRowSiHay("Punto de encuentro", d.puntoDeEncuentro);
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

  let asideHtml = "";
  asideHtml += infoRowSiHay("Dificultad", d.dificultad);
  asideHtml += infoRowSiHay("Alojamiento", d.alojamiento);
  asideHtml += infoRowSiHay("Comidas", d.comidas);
  if (d.fechas && d.fechas.length) {
    asideHtml += infoRowSiHay("Próximas fechas", d.fechas.join(" · "));
  }

  return { bodyHtml, asideHtml, badgeHtml: personalizableBadge(d.personalizable) };
}

/* ---- PAQUETE: viaje integral, personalizable ---- */
function renderDetallePaquete(d){
  let bodyHtml = "";
  bodyHtml += itinerarioSiHay(d.itinerario);
  bodyHtml += listaSiHay("Actividades incluidas", d.actividades, "check-list");

  // Tours y travesías que integra el paquete: se resuelven por id
  // contra el mismo array PROPUESTAS y se linkean a su propia ficha.
  const toursLinkeados = (d.toursIncluidos || []).map(getPropuestaPorId).filter(Boolean);
  const travesiasLinkeadas = (d.travesiasIncluidas || []).map(getPropuestaPorId).filter(Boolean);
  if (toursLinkeados.length) {
    bodyHtml += `<h2>Tours incluidos en este paquete</h2><ul class="check-list">${toursLinkeados.map(t => `<li><a href="propuesta.html?id=${t.id}">${t.nombre}</a></li>`).join("")}</ul>`;
  }
  if (travesiasLinkeadas.length) {
    bodyHtml += `<h2>Travesías incluidas en este paquete</h2><ul class="check-list">${travesiasLinkeadas.map(t => `<li><a href="propuesta.html?id=${t.id}">${t.nombre}</a></li>`).join("")}</ul>`;
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
        <h3>${d.slug === "peru" ? "Cusco" : d.nombre}</h3>
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
  if (!carousel || !track || !dotsWrap || typeof comentarios === "undefined" || !comentarios.length) return;

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
