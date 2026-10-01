/* =========================================================
   I18N — PROYECTO RAÍCES
   ---------------------------------------------------------
   Selector ES/EN del sitio. Sitio estático multipágina (sin
   build ni framework): la estrategia es la más simple que
   funciona en ese contexto.

   - El idioma elegido se guarda en localStorage y se aplica
     con un full reload al cambiarlo: no hay que reimplementar
     el render de cada fragmento dinámico para actualizarlo "en
     vivo" — la página siguiente ya nace en el idioma correcto.
   - Este script se carga al final del <body> (después de todo
     el HTML, antes de main.js): para cuando corre, el DOM ya
     existe completo, así que I18N.applyTo(document) corre de
     entrada, sin esperar DOMContentLoaded ni parpadeo de texto
     sin traducir.
   - Texto puramente de interfaz (nav, footer, botones,
     mensajes, estados) vive en el diccionario de abajo y se
     aplica vía atributos data-i18n* en el HTML o vía I18N.t()
     en main.js/los scripts inline de cada página.
   - Contenido dinámico de Supabase (nombre/resumen/descripción
     de destinos y experiencias, equipo, site_config) y las
     reseñas de comentarios-data.js NO se traducen acá: hoy sólo
     existen en español en la base/el archivo de datos. Pasarlos
     a inglés de verdad requeriría columnas bilingües en Supabase
     (ver nota en PROJECT-CONTEXT.md / respuesta al pedido que
     agregó este archivo) — no se inventa una traducción para
     ese contenido.
   ========================================================= */

const I18N = (() => {
  const STORAGE_KEY = "pr_lang";
  const DEFAULT_LANG = "es";

  const dict = {
    es: {
      /* ---------- Navegación ---------- */
      "nav.saltarContenido": "Saltar al contenido",
      "nav.abrirMenu": "Abrir menú",
      "nav.experiencias": "Experiencias",
      "nav.calendario": "Calendario",
      "nav.destinos": "Destinos",
      "nav.nosotros": "Nosotros",
      "nav.galeria": "Galería",
      "nav.contacto": "Contacto",
      "nav.reserva": "Reserva ahora",

      /* ---------- Selector de idioma ---------- */
      "lang.group": "Idioma",
      "lang.switchTo.es": "Cambiar a español",
      "lang.switchTo.en": "Cambiar a inglés",

      /* ---------- Footer ---------- */
      "footer.tagline.generic": "Turismo aventura con raíces. Experiencias en Argentina y Perú, para reconectar con la naturaleza.",
      "footer.tagline.home": "¿Tenés ganas de viajar? Escribinos y armamos juntos la propuesta ideal para vos.",
      "footer.tagline.galeria": "Turismo aventura con raíces en Argentina y Perú. Compartí tus fotos de viaje y sumate a la comunidad Raíces.",
      "footer.nav.title": "Navegación",
      "footer.more.title": "Más",
      "footer.social.title": "Redes & contacto",
      "footer.rights": "Todos los derechos reservados.",

      /* ---------- Comunes / reutilizables ---------- */
      "common.inicio": "Inicio",
      "common.tours": "Tours",
      "common.travesias": "Travesías",
      "common.paquetes": "Paquetes",
      "common.comentarios": "Comentarios",
      "common.catalogo": "Catálogo",
      "common.propuestas": "Propuestas",
      "common.elDestino": "el destino",
      "common.destinoLabel": "Destino",
      "common.solicitarInformacion": "Solicitar información",
      "common.verDetalles": "Ver detalles",
      "common.proximamente": "Próximamente",
      "common.contenidoEjemplo": "Contenido de ejemplo",
      "common.todos": "Todos",
      "common.todosLosDestinos": "Todos los destinos",
      "common.verTodosDestinosLink": "ver todos los destinos",
      "common.seleccionaDestino": "Seleccioná un destino",
      "common.aunNoSe": "Aún no sé, quiero más info",
      "common.mostrandoPropuestasEn": "Mostrando propuestas en",
      "common.volverPrefix": "← Volver a",
      "common.volverSimple": "← Volver",
      "common.consultarDisponibilidad": "Consultar disponibilidad",
      "common.noDisponible": "No disponible por el momento",

      /* ---------- Estados / mensajes ---------- */
      "common.loading": "Cargando…",
      "common.loadingDestinos": "Cargando destinos…",
      "common.errorExperiencias": "No pudimos cargar las experiencias en este momento. Probá recargar la página.",
      "common.errorExperienciasCorto": "No pudimos cargar las experiencias en este momento.",
      "common.errorDestinos": "No pudimos cargar los destinos en este momento. Probá recargar la página.",
      "common.errorPropuesta": "No pudimos cargar esta propuesta en este momento. Probá recargar la página.",
      "common.errorDestino": "No pudimos cargar este destino en este momento. Probá recargar la página.",
      "common.errorInfo": "No pudimos cargar esta información en este momento.",
      "common.sinPropuestasFiltro": "Todavía no hay propuestas cargadas para este filtro.<br>Muy pronto vamos a sumar más salidas.",
      "common.sinExperienciasCategoria": "Todavía no hay experiencias cargadas en esta categoría.",
      "common.sinExperienciasDestino": "Todavía no hay experiencias cargadas para este destino.<br>Muy pronto vamos a sumar más salidas.",
      "common.sinIntegrantes": "Todavía no hay integrantes cargados.",
      "common.sinResenas": "Todavía no tenemos reseñas publicadas. Muy pronto vamos a sumar acá las experiencias reales de quienes viajen con nosotros.",
      "common.noEncontramosPropuesta": "No encontramos esa propuesta.",
      "common.noEncontramosDestino": "No encontramos ese destino.",
      "common.volverADestinos": "Volver a Destinos",
      "common.tituloNoEncontradaPropuesta": "Propuesta no encontrada — Proyecto Raíces",
      "common.tituloNoEncontradoDestino": "Destino no encontrado — Proyecto Raíces",

      /* ---------- Aria-labels ---------- */
      "aria.expAnterior": "Ver experiencia anterior",
      "aria.expSiguiente": "Ver experiencia siguiente",
      "aria.destinoAnterior": "Ver destino anterior",
      "aria.destinoSiguiente": "Ver destino siguiente",
      "aria.comentarioAnterior": "Ver comentario anterior",
      "aria.comentarioSiguiente": "Ver comentario siguiente",
      "aria.cerrar": "Cerrar",
      "aria.fotoAnterior": "Foto anterior",
      "aria.fotoSiguiente": "Foto siguiente",
      "aria.escribinosWhatsapp": "Escribinos por WhatsApp",
      "aria.verDetallesDe": "Ver detalles de",
      "aria.ver": "Ver",
      "aria.conocerDestino": "Conocer",
      "aria.irAComentario": "Ir al comentario",
      "aria.de": "de",

      /* ---------- Tipos de propuesta ---------- */
      "tipo.tour.label": "Tour",
      "tipo.tour.labelPlural": "Tours",
      "tipo.travesia.label": "Travesía",
      "tipo.travesia.labelPlural": "Travesías",
      "tipo.paquete.label": "Paquete",
      "tipo.paquete.labelPlural": "Paquetes",

      /* ---------- Inicio ---------- */
      "home.hero.tagline": "TURISMO AVENTURA · ARGENTINA & PERÚ",
      "home.hero.verExperiencias": "Ver experiencias",
      "home.hero.calendarioViajes": "Calendario de viajes",
      "home.exp.kicker": "Elegí tu aventura",
      "home.exp.titulo": "Momentos para vivir distinto",
      "home.exp.verTodas": "Ver todas las experiencias",
      "home.destinos.titulo": "Principales destinos",
      "home.destinos.texto": "Conocé nuestros destinos y elegí tu próxima aventura.",
      "home.catalogo.kicker": "Catálogo",
      "home.catalogo.titulo": "Tours, travesías & paquetes",
      "home.catalogo.texto": "Tres formas distintas de vivir cada destino. Elegí la que mejor se adapta a vos.",
      "home.tours.h3": "Salidas de un día",
      "home.tours.p": "Salidas de un día para conocer nuevos lugares, compartir el camino y disfrutar la experiencia.",
      "home.tours.count": "Ver tours →",
      "home.travesias.h3": "Varios días de recorrido",
      "home.travesias.p": "Experiencias de varios días para recorrer, descubrir y conectar con cada lugar a otro ritmo.",
      "home.travesias.count": "Ver travesías →",
      "home.paquetes.h3": "Viajes de principio a fin",
      "home.paquetes.p": "Experiencias pensadas de principio a fin, con todo lo necesario para disfrutar cada destino.",
      "home.paquetes.count": "Ver paquetes →",
      "home.about.kicker": "Quiénes somos",
      "home.about.titulo": "Un proyecto que nace de la tierra",
      "home.about.texto": "Nace de una misma idea: viajar despacio, en grupos chicos, y conectar de verdad con cada lugar que recorremos.",
      "home.stat1.b": "3 personas",
      "home.stat1.span": "Armamos Proyecto Raíces para viajar distinto",
      "home.stat2.b": "3 formatos",
      "home.stat2.span": "Tours, travesías y paquetes",
      "home.stat3.b": "Acompañamiento real",
      "home.stat3.span": "Te acompañamos de principio a fin",
      "home.equipo.cta": "Conocé nuestra historia →",
      "home.testi.kicker": "Lo que dicen",
      "home.testi.titulo": "Comentarios de quienes viajaron",
      "home.comunidad.kicker": "Comunidad Raíces",
      "home.comunidad.titulo": "¿Viviste una experiencia con Proyecto Raíces?",
      "home.comunidad.texto": "Queremos que tu viaje también sea parte de nuestra historia.",
      "home.comunidad.cta": "Compartí tus fotos →",
      "home.cta.titulo": "¿Ya sabés a dónde querés ir?",
      "home.cta.texto": "Contanos qué estás buscando y armamos la salida ideal para vos o tu grupo.",
      "home.cta.explorarDestinos": "Explorar destinos",

      /* ---------- Nosotros ---------- */
      "nosotros.kicker": "Un proyecto que nace de la tierra",
      "nosotros.h1": "Nosotros",
      "nosotros.intro.p": "Proyecto Raíces reúne experiencias para conocer cada destino de una manera diferente, combinando naturaleza, cultura, aventura y encuentros.",
      "nosotros.historia.kicker": "Nuestra historia",
      "nosotros.historia.h2": "Somos Proyecto Raíces",
      "nosotros.historia.lead": "Somos tres personas de Buenos Aires que un día decidimos convertir nuestra forma de viajar en un proyecto: ir despacio, en grupos chicos, y volver de cada lugar habiendo entendido algo más de él.",
      "nosotros.historia.p2": "Armamos cada propuesta junto a guías y comunidades locales, cuidando los lugares que recorremos y priorizando experiencias reales por sobre los circuitos de siempre.",
      "nosotros.equipo.kicker": "Quiénes armamos esto",
      "nosotros.valores.kicker": "Nuestra propuesta",
      "nosotros.valores.h2": "Cómo viajamos",
      "nosotros.valores.p": "Ya sea un día o varias semanas, armamos cada salida de la misma manera: despacio, en grupo chico y mirando el lugar de cerca. Elegí el formato que más se ajuste a tu tiempo — el espíritu es siempre el mismo.",
      "nosotros.valor1.h3": "Grupos chicos",
      "nosotros.valor1.p": "Viajamos con pocas personas a la vez, para que cada salida se sienta cercana y nunca una excursión más entre desconocidos.",
      "nosotros.valor2.h3": "Conexión con el lugar",
      "nosotros.valor2.p": "No miramos el paisaje desde la ventanilla: paramos, caminamos y le damos tiempo a cada lugar para que se muestre de verdad.",
      "nosotros.valor3.h3": "Mirada responsable",
      "nosotros.valor3.p": "Viajamos de la mano de guías y comunidades locales, cuidando cada rincón que recorremos como si fuera propio.",
      "nosotros.cta.h2": "¿Querés conocernos mejor?",
      "nosotros.cta.p": "Escribinos y contanos qué tipo de experiencia estás buscando.",
      "nosotros.cta.contactanos": "Contactanos",
      "nosotros.cta.verDestinos": "Ver destinos",

      /* ---------- Contacto ---------- */
      "contacto.h1": "Contacto",
      "contacto.p": "Encontrá la experiencia que estás buscando.",
      "contacto.kicker": "Hablemos",
      "contacto.h2": "Canales de contacto",
      "contacto.whatsappProntoBox": "💬 Muy pronto vas a poder escribirnos directo por WhatsApp. Mientras tanto, elegí cualquiera de estos canales.",
      "contacto.form.nombreLabel": "Nombre",
      "contacto.form.nombrePlaceholder": "Tu nombre",
      "contacto.form.destinoLabel": "Destino de interés",
      "contacto.form.mensajeLabel": "Mensaje",
      "contacto.form.mensajePlaceholder": "Contanos qué estás buscando...",
      "contacto.form.nota": "Te responderemos lo antes posible.",
      "contacto.form.enviar": "Enviar consulta",
      "contacto.form.errorCampos": "Completá nombre, email y mensaje para enviar tu consulta.",
      "contacto.form.enviando": "Enviando tu consulta…",
      "contacto.form.exito": "¡Gracias! Recibimos tu consulta y te vamos a responder a la brevedad.",
      "contacto.form.error": "No pudimos enviar tu consulta. Probá de nuevo en unos minutos, o escribinos por WhatsApp.",
      "contacto.mensajePrecargado": 'Hola, quiero consultar por "{{propuesta}}".',

      /* ---------- Galería ---------- */
      "galeria.h1": "Galería",
      "galeria.p": "De cada viaje quedan postales sueltas: rutas, gente y paisajes que fuimos guardando salida a salida.",
      "galeria.comunidad.p": "Queremos que tu viaje también sea parte de nuestra historia. Compartí tus mejores fotos y momentos con nosotros y, con tu autorización, podremos sumarlos a nuestra galería y compartirlos en nuestros canales.",
      "galeria.enviaFotosA": "Enviá tus fotos a",
      "galeria.fotosForm.mensajeLabel": "Mensaje (opcional)",
      "galeria.fotosForm.mensajePlaceholder": "Contanos en qué experiencia sacaste estas fotos...",
      "galeria.fotosForm.fotosLabel": "Fotos",
      "galeria.fotosForm.nota": "Hasta 8 fotos por envío, JPG/PNG/WEBP/HEIC, máximo 8MB cada una.",
      "galeria.fotosForm.enviar": "Enviar fotos",
      "galeria.fotosForm.errorCampos": "Completá nombre y email para enviar tus fotos.",
      "galeria.fotosForm.errorSinFotos": "Elegí al menos una foto para enviar.",
      "galeria.fotosForm.errorMaxCantidad": "Podés enviar hasta {{max}} fotos por envío.",
      "galeria.fotosForm.errorFormato": '"{{nombre}}" no es un formato de imagen admitido (JPG, PNG, WEBP o HEIC).',
      "galeria.fotosForm.errorPeso": '"{{nombre}}" pesa más de 8MB. Elegí una foto más liviana.',
      "galeria.fotosForm.subiendo": "Subiendo tus fotos…",
      "galeria.fotosForm.enviandoNotif": "Enviando la notificación…",
      "galeria.fotosForm.exito": "¡Gracias! Recibimos tus fotos. Pronto las publicaremos en nuestra galería.",
      "galeria.fotosForm.error": "No pudimos enviar tus fotos. Probá de nuevo en unos minutos.",
      "galeria.cta.h2": "¿Querés ser parte de la próxima foto?",
      "galeria.cta.p": "Sumate a una de nuestras salidas.",
      "galeria.alt.01": "Viajera con los brazos abiertos frente a Machu Picchu",
      "galeria.alt.02": "Artesana cusqueña con sombrero tradicional",
      "galeria.alt.03": "Excursionista mirando un nevado en la Cordillera",
      "galeria.alt.04": "Alpaca frente a las ruinas de Sacsayhuamán, Cusco",
      "galeria.alt.05": "Vicuñas en la puna peruana",
      "galeria.alt.06": "Mirando las salineras de Maras, Perú",
      "galeria.alt.07": "Descanso frente al lago con el Cerro Tronador de fondo, Bariloche",
      "galeria.alt.08": "Puesto de artesanías en un pueblo andino, con banderas peruanas",
      "galeria.alt.09": "Terrazas de Machu Picchu, Perú",
      "galeria.alt.10": "Lanas teñidas a mano, artesanía textil andina",
      "galeria.alt.11": "Patagonia",
      "galeria.alt.12": "Cordón rocoso camino al Refugio Frey, Bariloche",
      "galeria.alt.13": "Faro histórico en el canal de Beagle, Ushuaia",
      "galeria.alt.14": "Vista al lago",
      "galeria.alt.15": "Cielo estrellado sobre la montaña, Tierra del Fuego",
      "galeria.alt.16": "Calle empedrada en Cusco al atardecer",
      "galeria.alt.17": "Cascada en el sendero hacia Laguna Negra, Bariloche",
      "galeria.alt.18": "Ave posada en una roca de altura, fauna de montaña",
      "galeria.alt.19": "Brazo del lago Nahuel Huapi entre montañas, Bariloche",
      "galeria.alt.20": "Vista panorámica de lagos y bosques desde el Cerro Campanario, Bariloche",
      "galeria.alt.21": "Vías del tren rumbo a Machu Picchu entre la selva",
      "galeria.alt.22": "Vista de los techos de tejas de Cusco desde una calle en pendiente",
      "galeria.alt.23": "Mujeres con vestimenta tradicional cusqueña y alpacas en un portal de piedra",
      "galeria.alt.24": "Callejón empedrado entre casas coloniales de Cusco",
      "galeria.alt.25": "Cerros multicolor de una quebrada del norte argentino",
      "galeria.alt.26": "Formaciones montañosas multicolor del norte argentino",

      /* ---------- Comentarios ---------- */
      "comentarios.eyebrow": "Lo que dicen",
      "comentarios.h1": "Comentarios",
      "comentarios.p": "Experiencias contadas por quienes ya viajaron con nosotros.",
      "comentarios.cta.h2": "Sumá tu experiencia a la lista",
      "comentarios.cta.p": "Viajá con nosotros y contanos cómo te fue.",

      /* ---------- Calendario ---------- */
      "calendario.h1": "Calendario de viajes",
      "calendario.empty.h2": "Todavía no hay salidas con fecha confirmada",
      "calendario.empty.p": "Estamos armando el calendario de próximas travesías y paquetes. Mientras tanto, contanos qué destino te interesa y te avisamos apenas tengamos fechas.",
      "calendario.cta.h2": "¿No encontrás fecha para tu destino?",
      "calendario.cta.p": "Contanos qué destino te interesa y te avisamos apenas tengamos una salida confirmada.",

      /* ---------- Destinos ---------- */
      "destinos.cta.h2": "¿Tenés un destino en mente?",
      "destinos.cta.p": "Si no lo ves en la lista, contanos: armamos paquetes a medida.",
      "destinos.lead": "Los lugares que <em>recorremos</em> con vos",
      "destinos.explorarDestino": "Explorar destino →",

      /* ---------- Catálogo ---------- */
      "catalogo.titulo.default": "Propuestas por destino",
      "catalogo.resumen.default": "Tours, travesías y paquetes disponibles, pensados para grupos chicos y con guías locales.",
      "catalogo.exp.titulo": "Todas las experiencias",
      "catalogo.cta.h2": "¿No encontrás lo que buscás?",
      "catalogo.cta.p": "Contanos qué tenés en mente y te ayudamos a armar la experiencia ideal.",
      "catalogo.experienciasEn": "Experiencias en {{nombre}}",

      /* ---------- Tours / Travesías / Paquetes / Experiencias ---------- */
      "tours.kicker": "Medio día · día completo",
      "tours.p": "Salidas ideales para conocer un lugar sin comprometer todo tu viaje.",
      "tours.cta.h2": "¿No encontrás el tour que buscás?",
      "tours.cta.p": "Contanos qué tenés en mente y te ayudamos a armar el plan ideal.",
      "travesias.kicker": "Días enteros para recorrer",
      "travesias.h1": "Travesías",
      "travesias.cta.h2": "¿Buscás una travesía a medida?",
      "travesias.cta.p": "Contanos las fechas y el destino que tenés en mente.",
      "paquetes.kicker": "Viajás, nosotros resolvemos",
      "paquetes.h1": "Paquetes",
      "paquetes.p": "Todo resuelto para vivir el destino sin preocuparte por la logística.",
      "paquetes.cta.h2": "¿Querés armar un paquete a medida?",
      "paquetes.cta.p": "Cada paquete se arma según lo que estás buscando: contanos tu idea.",
      "experiencias.kicker": "Elegí cómo viajar",

      /* ---------- Destino editorial (destino.html) ---------- */
      "destino.enEsteLugar.kicker": "En este lugar",
      "destino.enEsteLugar.h2": "Así se ve, en las experiencias que ya recorrimos",
      "destino.experiencias.h2": "Experiencias en {{nombre}}",
      "destino.tipoEnNombre": "{{tipo}} en {{nombre}}",
      "destino.cta.h2": "¿Querés armar tu viaje a {{nombre}}?",
      "destino.cta.p": "Contanos qué tenés en mente y te ayudamos a resolverlo.",
      "destino.verTodasExperienciasDe": "Ver todas las experiencias de {{nombre}} →",
      "destino.cuandoIr": "Cuándo ir",
      "destino.comoLlegar": "Cómo llegar",
      "destino.naturalezaCultura": "Naturaleza y cultura",
      "destino.presentaTexto": "Estamos redactando la presentación editorial de {{nombre}} — muy pronto vas a poder leerla acá.",

      /* ---------- Detalle de propuesta ---------- */
      "propuesta.descripcion": "Descripción",
      "propuesta.queIncluye": "Qué incluye",
      "propuesta.queNoIncluye": "Qué no incluye",
      "propuesta.infoImportante": "Información importante",
      "propuesta.precio": "Precio",
      "propuesta.notaReserva.salida": "Esta salida puede reservarse de forma privada, sólo para tu grupo, sujeto a disponibilidad.",
      "propuesta.notaReserva.travesia": "Esta travesía puede reservarse de forma privada, sólo para tu grupo, sujeto a disponibilidad.",
      "propuesta.notaReserva.paquete": "El itinerario puede conversarse y adaptarse según las necesidades del grupo, cuando resulte viable.",
      "propuesta.placeholderNotice": "⚠️ Esta es una propuesta de ejemplo, incluida sólo para mostrar cómo funciona la ficha de detalle. Reemplazá este contenido por el real antes de publicar.",
      "propuesta.whatsappTour": 'Hola, quiero consultar por el Tour "{{nombre}}".',
      "propuesta.whatsappTravesia": 'Hola, quiero consultar por la Travesía "{{nombre}}".',

      /* ---------- Detalle (aside / bloques específicos) ---------- */
      "detalle.duracion": "Duración",
      "detalle.modalidad": "Modalidad",
      "detalle.dificultad": "Dificultad",
      "detalle.fecha": "Fecha",
      "detalle.salida": "Salida",
      "detalle.regreso": "Regreso",
      "detalle.fechas": "Fechas",
      "detalle.recorrido": "Recorrido",
      "detalle.itinerario": "Itinerario",
      "detalle.dia": "Día",
      "detalle.personalizable": "Personalizable",
      "detalle.logisticaNoIncluida": "Qué no cubre la logística",
      "detalle.actividadesIncluidas": "Actividades incluidas",
      "detalle.toursIncluidos": "Tours incluidos en este paquete",
      "detalle.travesiasIncluidas": "Travesías incluidas en este paquete",
      "detalle.combinable": "Este tour se puede combinar con otros tours.",
      "detalle.combinableConvierte": " Al combinarlo, la salida se convierte en una travesía de varios días.",

      /* ---------- Equipo ---------- */
      "equipo.parteDelEquipo": ", parte del equipo de Proyecto Raíces",

      /* ---------- WhatsApp / mailto por defecto ---------- */
      "whatsapp.mensajeDefault": "Hola, quiero consultar por una experiencia de Proyecto Raíces.",
      "mailto.asuntoDefault": "Consulta desde la web",

      /* ---------- Metadatos de páginas estáticas (title, meta description, alt) ---------- */
      "meta.home.title": "Proyecto Raíces — Turismo aventura en Argentina y Perú",
      "meta.experiencias.title": "Experiencias — Proyecto Raíces",
      "meta.destinos.title": "Destinos — Proyecto Raíces",
      "meta.destino.title": "Destino — Proyecto Raíces",
      "meta.tours.title": "Tours — Proyecto Raíces",
      "meta.travesias.title": "Travesías — Proyecto Raíces",
      "meta.paquetes.title": "Paquetes — Proyecto Raíces",
      "meta.propuesta.title": "Propuesta — Proyecto Raíces",
      "meta.nosotros.title": "Nosotros — Proyecto Raíces",
      "meta.galeria.title": "Galería — Proyecto Raíces",
      "meta.comentarios.title": "Comentarios — Proyecto Raíces",
      "meta.contacto.title": "Contacto — Proyecto Raíces",
      "meta.home.desc": "Proyecto Raíces crea y selecciona experiencias de viaje únicas para conectar personas con destinos, culturas y momentos que quedan para siempre. Trekking, camping y salidas guiadas en Argentina y Perú.",
      "meta.experiencias.desc": "Tours, travesías y paquetes de Proyecto Raíces en un solo lugar: elegí tu próxima aventura en Argentina y Perú.",
      "meta.destinos.desc": "Descubrí los destinos de Proyecto Raíces: Bariloche, Ushuaia, San Martín de los Andes, Villa Pehuenia y Norte Neuquino en Argentina, y Cusco (Perú) a nivel internacional.",
      "meta.destino.desc": "Conocé cada destino de Proyecto Raíces: identidad del lugar, fotos reales y las experiencias disponibles ahí.",
      "meta.tours.desc": "Tours de medio día y día completo de Proyecto Raíces: actividades guiadas de trekking, camping y naturaleza en Argentina y Perú.",
      "meta.travesias.desc": "Travesías de varios días de Proyecto Raíces: trekking y camping en Argentina y Perú.",
      "meta.paquetes.desc": "Paquetes de viaje integrales de Proyecto Raíces en Argentina y Perú, con atención personalizada de principio a fin.",
      "meta.propuesta.desc": "Detalle de tour, travesía o paquete de turismo aventura de Proyecto Raíces.",
      "meta.nosotros.desc": "Conocé a Proyecto Raíces: quiénes somos, nuestra propuesta de valor y cómo creamos experiencias de viaje en Argentina y Perú.",
      "meta.galeria.desc": "Galería de fotos de las experiencias y salidas de Proyecto Raíces en Argentina y Perú.",
      "meta.comentarios.desc": "Lo que dicen los viajeros que ya vivieron una experiencia con Proyecto Raíces.",
      "meta.contacto.desc": "Contactate con Proyecto Raíces para consultar disponibilidad, armar un viaje a medida o resolver dudas sobre nuestras experiencias en Argentina y Perú.",
      "alt.home.hero": "Laguna y montañas de la Cordillera, uno de los paisajes que conecta Proyecto Raíces",
      "alt.home.tours": "Tours",
      "alt.home.travesias": "Travesías",
      "alt.home.paquetes": "Paquetes",
      "alt.home.quienesSomos": "Fotografía de Proyecto Raíces en uno de nuestros destinos",
      "alt.nosotros.hero": "Mujer cusqueña compartiendo su oficio artesanal, parte de las comunidades con las que trabajamos",
      "alt.nosotros.historia": "Caminando hacia una ciudadela inca entre las montañas, el ritmo despacio que define cada salida",
      "alt.paquetes.hero": "Viajera con los brazos abiertos frente a Machu Picchu, disfrutando un viaje resuelto de principio a fin",
      "alt.tours.hero": "Recorriendo un mercado andino de artesanías, una experiencia real de viaje",
      "alt.tours.intro": "Vida local en una calle de Cusco, parte de la experiencia de un tour",
      "alt.travesias.hero": "Vista amplia de lagos y montañas patagónicas, el paisaje que se recorre a lo largo de varios días",
      "alt.travesias.intro": "Llamas frente a picos nevados en la cordillera, protagonistas del camino"
    },

    en: {
      /* ---------- Navigation ---------- */
      "nav.saltarContenido": "Skip to content",
      "nav.abrirMenu": "Open menu",
      "nav.experiencias": "Experiences",
      "nav.calendario": "Calendar",
      "nav.destinos": "Destinations",
      "nav.nosotros": "About us",
      "nav.galeria": "Gallery",
      "nav.contacto": "Contact",
      "nav.reserva": "Book now",

      /* ---------- Language switcher ---------- */
      "lang.group": "Language",
      "lang.switchTo.es": "Switch to Spanish",
      "lang.switchTo.en": "Switch to English",

      /* ---------- Footer ---------- */
      "footer.tagline.generic": "Adventure tourism with roots. Experiences in Argentina and Peru, to reconnect with nature.",
      "footer.tagline.home": "Feeling like traveling? Write to us and let's design the ideal trip together.",
      "footer.tagline.galeria": "Adventure tourism with roots in Argentina and Peru. Share your travel photos and join the Raíces community.",
      "footer.nav.title": "Navigation",
      "footer.more.title": "More",
      "footer.social.title": "Social & contact",
      "footer.rights": "All rights reserved.",

      /* ---------- Common / reusable ---------- */
      "common.inicio": "Home",
      "common.tours": "Tours",
      "common.travesias": "Treks",
      "common.paquetes": "Packages",
      "common.comentarios": "Reviews",
      "common.catalogo": "Catalog",
      "common.propuestas": "Listings",
      "common.elDestino": "the destination",
      "common.destinoLabel": "Destination",
      "common.solicitarInformacion": "Request information",
      "common.verDetalles": "View details",
      "common.proximamente": "Coming soon",
      "common.contenidoEjemplo": "Sample content",
      "common.todos": "All",
      "common.todosLosDestinos": "All destinations",
      "common.verTodosDestinosLink": "view all destinations",
      "common.seleccionaDestino": "Select a destination",
      "common.aunNoSe": "Not sure yet, I want more info",
      "common.mostrandoPropuestasEn": "Showing listings in",
      "common.volverPrefix": "← Back to",
      "common.volverSimple": "← Back",
      "common.consultarDisponibilidad": "Check availability",
      "common.noDisponible": "Not available right now",

      /* ---------- States / messages ---------- */
      "common.loading": "Loading…",
      "common.loadingDestinos": "Loading destinations…",
      "common.errorExperiencias": "We couldn't load the experiences right now. Try reloading the page.",
      "common.errorExperienciasCorto": "We couldn't load the experiences right now.",
      "common.errorDestinos": "We couldn't load the destinations right now. Try reloading the page.",
      "common.errorPropuesta": "We couldn't load this listing right now. Try reloading the page.",
      "common.errorDestino": "We couldn't load this destination right now. Try reloading the page.",
      "common.errorInfo": "We couldn't load this information right now.",
      "common.sinPropuestasFiltro": "There are no listings for this filter yet.<br>We'll be adding more trips soon.",
      "common.sinExperienciasCategoria": "There are no experiences in this category yet.",
      "common.sinExperienciasDestino": "There are no experiences for this destination yet.<br>We'll be adding more trips soon.",
      "common.sinIntegrantes": "No team members yet.",
      "common.sinResenas": "We don't have published reviews yet. We'll soon add real experiences from travelers here.",
      "common.noEncontramosPropuesta": "We couldn't find that listing.",
      "common.noEncontramosDestino": "We couldn't find that destination.",
      "common.volverADestinos": "Back to Destinations",
      "common.tituloNoEncontradaPropuesta": "Listing not found — Proyecto Raíces",
      "common.tituloNoEncontradoDestino": "Destination not found — Proyecto Raíces",

      /* ---------- Aria-labels ---------- */
      "aria.expAnterior": "See previous experience",
      "aria.expSiguiente": "See next experience",
      "aria.destinoAnterior": "See previous destination",
      "aria.destinoSiguiente": "See next destination",
      "aria.comentarioAnterior": "See previous review",
      "aria.comentarioSiguiente": "See next review",
      "aria.cerrar": "Close",
      "aria.fotoAnterior": "Previous photo",
      "aria.fotoSiguiente": "Next photo",
      "aria.escribinosWhatsapp": "Message us on WhatsApp",
      "aria.verDetallesDe": "View details of",
      "aria.ver": "View",
      "aria.conocerDestino": "Discover",
      "aria.irAComentario": "Go to review",
      "aria.de": "of",

      /* ---------- Listing types ---------- */
      "tipo.tour.label": "Tour",
      "tipo.tour.labelPlural": "Tours",
      "tipo.travesia.label": "Trek",
      "tipo.travesia.labelPlural": "Treks",
      "tipo.paquete.label": "Package",
      "tipo.paquete.labelPlural": "Packages",

      /* ---------- Home ---------- */
      "home.hero.tagline": "ADVENTURE TOURISM · ARGENTINA & PERU",
      "home.hero.verExperiencias": "View experiences",
      "home.hero.calendarioViajes": "Travel calendar",
      "home.exp.kicker": "Choose your adventure",
      "home.exp.titulo": "Moments to live differently",
      "home.exp.verTodas": "View all experiences",
      "home.destinos.titulo": "Top destinations",
      "home.destinos.texto": "Discover our destinations and choose your next adventure.",
      "home.catalogo.kicker": "Catalog",
      "home.catalogo.titulo": "Tours, treks & packages",
      "home.catalogo.texto": "Three different ways to experience each destination. Choose the one that suits you best.",
      "home.tours.h3": "One-day trips",
      "home.tours.p": "One-day trips to discover new places, share the journey and enjoy the experience.",
      "home.tours.count": "View tours →",
      "home.travesias.h3": "Several days on the road",
      "home.travesias.p": "Multi-day experiences to explore, discover and connect with each place at a different pace.",
      "home.travesias.count": "View treks →",
      "home.paquetes.h3": "Trips from start to finish",
      "home.paquetes.p": "Experiences planned from start to finish, with everything you need to enjoy each destination.",
      "home.paquetes.count": "View packages →",
      "home.about.kicker": "Who we are",
      "home.about.titulo": "A project born from the land",
      "home.about.texto": "Born from one idea: travel slowly, in small groups, and truly connect with every place we visit.",
      "home.stat1.b": "3 people",
      "home.stat1.span": "We started Proyecto Raíces to travel differently",
      "home.stat2.b": "3 formats",
      "home.stat2.span": "Tours, treks and packages",
      "home.stat3.b": "Real support",
      "home.stat3.span": "We're with you from start to finish",
      "home.equipo.cta": "Discover our story →",
      "home.testi.kicker": "What people say",
      "home.testi.titulo": "Reviews from those who traveled",
      "home.comunidad.kicker": "Raíces Community",
      "home.comunidad.titulo": "Did you experience a trip with Proyecto Raíces?",
      "home.comunidad.texto": "We want your trip to be part of our story too.",
      "home.comunidad.cta": "Share your photos →",
      "home.cta.titulo": "Already know where you want to go?",
      "home.cta.texto": "Tell us what you're looking for and we'll design the ideal trip for you or your group.",
      "home.cta.explorarDestinos": "Explore destinations",

      /* ---------- About us ---------- */
      "nosotros.kicker": "A project born from the land",
      "nosotros.h1": "About us",
      "nosotros.intro.p": "Proyecto Raíces brings together experiences to discover each destination in a different way, combining nature, culture, adventure and encounters.",
      "nosotros.historia.kicker": "Our story",
      "nosotros.historia.h2": "We are Proyecto Raíces",
      "nosotros.historia.lead": "We're three people from Buenos Aires who one day decided to turn our way of traveling into a project: go slow, in small groups, and come back from every place having understood a little more of it.",
      "nosotros.historia.p2": "We build every trip together with local guides and communities, taking care of the places we visit and prioritizing real experiences over the usual circuits.",
      "nosotros.equipo.kicker": "Who's behind this",
      "nosotros.valores.kicker": "Our approach",
      "nosotros.valores.h2": "How we travel",
      "nosotros.valores.p": "Whether it's one day or several weeks, we plan every trip the same way: slowly, in a small group, looking closely at the place. Choose the format that best fits your time — the spirit is always the same.",
      "nosotros.valor1.h3": "Small groups",
      "nosotros.valor1.p": "We travel with just a few people at a time, so every trip feels personal and never just another tour among strangers.",
      "nosotros.valor2.h3": "Connection with the place",
      "nosotros.valor2.p": "We don't watch the landscape from the window: we stop, we walk, and we give each place time to truly reveal itself.",
      "nosotros.valor3.h3": "A responsible approach",
      "nosotros.valor3.p": "We travel hand in hand with local guides and communities, caring for every corner we visit as if it were our own.",
      "nosotros.cta.h2": "Want to get to know us better?",
      "nosotros.cta.p": "Write to us and tell us what kind of experience you're looking for.",
      "nosotros.cta.contactanos": "Contact us",
      "nosotros.cta.verDestinos": "View destinations",

      /* ---------- Contact ---------- */
      "contacto.h1": "Contact",
      "contacto.p": "Find the experience you're looking for.",
      "contacto.kicker": "Let's talk",
      "contacto.h2": "Contact channels",
      "contacto.whatsappProntoBox": "💬 Soon you'll be able to message us directly on WhatsApp. In the meantime, pick any of these channels.",
      "contacto.form.nombreLabel": "Name",
      "contacto.form.nombrePlaceholder": "Your name",
      "contacto.form.destinoLabel": "Destination of interest",
      "contacto.form.mensajeLabel": "Message",
      "contacto.form.mensajePlaceholder": "Tell us what you're looking for...",
      "contacto.form.nota": "We'll get back to you as soon as possible.",
      "contacto.form.enviar": "Send inquiry",
      "contacto.form.errorCampos": "Fill in name, email and message to send your inquiry.",
      "contacto.form.enviando": "Sending your inquiry…",
      "contacto.form.exito": "Thank you! We received your inquiry and will get back to you shortly.",
      "contacto.form.error": "We couldn't send your inquiry. Try again in a few minutes, or message us on WhatsApp.",
      "contacto.mensajePrecargado": 'Hi, I\'d like to ask about "{{propuesta}}".',

      /* ---------- Gallery ---------- */
      "galeria.h1": "Gallery",
      "galeria.p": "Every trip leaves loose postcards behind: routes, people and landscapes we've been collecting trip after trip.",
      "galeria.comunidad.p": "We want your trip to be part of our story too. Share your best photos and moments with us and, with your permission, we may add them to our gallery and share them on our channels.",
      "galeria.enviaFotosA": "Send your photos to",
      "galeria.fotosForm.mensajeLabel": "Message (optional)",
      "galeria.fotosForm.mensajePlaceholder": "Tell us which experience these photos are from...",
      "galeria.fotosForm.fotosLabel": "Photos",
      "galeria.fotosForm.nota": "Up to 8 photos per submission, JPG/PNG/WEBP/HEIC, max 8MB each.",
      "galeria.fotosForm.enviar": "Send photos",
      "galeria.fotosForm.errorCampos": "Fill in name and email to send your photos.",
      "galeria.fotosForm.errorSinFotos": "Choose at least one photo to send.",
      "galeria.fotosForm.errorMaxCantidad": "You can send up to {{max}} photos per submission.",
      "galeria.fotosForm.errorFormato": '"{{nombre}}" isn\'t a supported image format (JPG, PNG, WEBP or HEIC).',
      "galeria.fotosForm.errorPeso": '"{{nombre}}" is larger than 8MB. Choose a lighter photo.',
      "galeria.fotosForm.subiendo": "Uploading your photos…",
      "galeria.fotosForm.enviandoNotif": "Sending the notification…",
      "galeria.fotosForm.exito": "Thank you! We received your photos. We'll publish them in our gallery soon.",
      "galeria.fotosForm.error": "We couldn't send your photos. Try again in a few minutes.",
      "galeria.cta.h2": "Want to be part of the next photo?",
      "galeria.cta.p": "Join one of our trips.",
      "galeria.alt.01": "Traveler with arms wide open in front of Machu Picchu",
      "galeria.alt.02": "Cusco artisan wearing a traditional hat",
      "galeria.alt.03": "Hiker looking at a snow-capped peak in the Cordillera",
      "galeria.alt.04": "Alpaca in front of the Sacsayhuamán ruins, Cusco",
      "galeria.alt.05": "Vicuñas on the Peruvian high plateau",
      "galeria.alt.06": "Looking at the Maras salt pans, Peru",
      "galeria.alt.07": "Resting by the lake with Cerro Tronador in the background, Bariloche",
      "galeria.alt.08": "Craft stall in an Andean town, with Peruvian flags",
      "galeria.alt.09": "Terraces of Machu Picchu, Peru",
      "galeria.alt.10": "Hand-dyed wool, Andean textile craftsmanship",
      "galeria.alt.11": "Patagonia",
      "galeria.alt.12": "Rocky ridge on the way to Refugio Frey, Bariloche",
      "galeria.alt.13": "Historic lighthouse in the Beagle Channel, Ushuaia",
      "galeria.alt.14": "Lake view",
      "galeria.alt.15": "Starry sky over the mountains, Tierra del Fuego",
      "galeria.alt.16": "Cobblestone street in Cusco at sunset",
      "galeria.alt.17": "Waterfall on the trail to Laguna Negra, Bariloche",
      "galeria.alt.18": "Bird perched on a high-altitude rock, mountain wildlife",
      "galeria.alt.19": "Arm of Lake Nahuel Huapi between mountains, Bariloche",
      "galeria.alt.20": "Panoramic view of lakes and forests from Cerro Campanario, Bariloche",
      "galeria.alt.21": "Train tracks heading to Machu Picchu through the jungle",
      "galeria.alt.22": "View of Cusco's tiled rooftops from a sloped street",
      "galeria.alt.23": "Women in traditional Cusco dress with alpacas at a stone gateway",
      "galeria.alt.24": "Cobblestone alley between colonial houses in Cusco",
      "galeria.alt.25": "Multicolored hills of a canyon in northern Argentina",
      "galeria.alt.26": "Multicolored mountain formations in northern Argentina",

      /* ---------- Reviews page ---------- */
      "comentarios.eyebrow": "What people say",
      "comentarios.h1": "Reviews",
      "comentarios.p": "Experiences told by those who've already traveled with us.",
      "comentarios.cta.h2": "Add your experience to the list",
      "comentarios.cta.p": "Travel with us and tell us how it went.",

      /* ---------- Calendar ---------- */
      "calendario.h1": "Travel calendar",
      "calendario.empty.h2": "No trips with a confirmed date yet",
      "calendario.empty.p": "We're putting together the calendar of upcoming treks and packages. In the meantime, tell us which destination interests you and we'll let you know as soon as we have dates.",
      "calendario.cta.h2": "Can't find a date for your destination?",
      "calendario.cta.p": "Tell us which destination interests you and we'll let you know as soon as we have a confirmed trip.",

      /* ---------- Destinations ---------- */
      "destinos.cta.h2": "Have a destination in mind?",
      "destinos.cta.p": "If you don't see it on the list, tell us: we'll create a custom package.",
      "destinos.lead": "The places we <em>explore</em> with you",
      "destinos.explorarDestino": "Explore destination →",

      /* ---------- Catalog ---------- */
      "catalogo.titulo.default": "Trips by destination",
      "catalogo.resumen.default": "Available tours, treks and packages, designed for small groups with local guides.",
      "catalogo.exp.titulo": "All experiences",
      "catalogo.cta.h2": "Can't find what you're looking for?",
      "catalogo.cta.p": "Tell us what you have in mind and we'll help you plan the ideal experience.",
      "catalogo.experienciasEn": "Experiences in {{nombre}}",

      /* ---------- Tours / Treks / Packages / Experiences ---------- */
      "tours.kicker": "Half day · full day",
      "tours.p": "Perfect trips to discover a place without committing your whole vacation.",
      "tours.cta.h2": "Can't find the tour you're looking for?",
      "tours.cta.p": "Tell us what you have in mind and we'll help you plan the ideal trip.",
      "travesias.kicker": "Full days to explore",
      "travesias.h1": "Treks",
      "travesias.cta.h2": "Looking for a custom trek?",
      "travesias.cta.p": "Tell us the dates and destination you have in mind.",
      "paquetes.kicker": "You travel, we handle the rest",
      "paquetes.h1": "Packages",
      "paquetes.p": "Everything sorted so you can enjoy the destination without worrying about logistics.",
      "paquetes.cta.h2": "Want to build a custom package?",
      "paquetes.cta.p": "Every package is built around what you're looking for: tell us your idea.",
      "experiencias.kicker": "Choose how to travel",

      /* ---------- Destination editorial page ---------- */
      "destino.enEsteLugar.kicker": "In this place",
      "destino.enEsteLugar.h2": "This is what it looks like, in the experiences we've already had",
      "destino.experiencias.h2": "Experiences in {{nombre}}",
      "destino.tipoEnNombre": "{{tipo}} in {{nombre}}",
      "destino.cta.h2": "Want to plan your trip to {{nombre}}?",
      "destino.cta.p": "Tell us what you have in mind and we'll help make it happen.",
      "destino.verTodasExperienciasDe": "View all experiences in {{nombre}} →",
      "destino.cuandoIr": "When to go",
      "destino.comoLlegar": "How to get there",
      "destino.naturalezaCultura": "Nature and culture",
      "destino.presentaTexto": "We're writing the editorial introduction for {{nombre}} — you'll be able to read it here very soon.",

      /* ---------- Listing detail ---------- */
      "propuesta.descripcion": "Description",
      "propuesta.queIncluye": "What's included",
      "propuesta.queNoIncluye": "What's not included",
      "propuesta.infoImportante": "Important information",
      "propuesta.precio": "Price",
      "propuesta.notaReserva.salida": "This trip can be booked privately, just for your group, subject to availability.",
      "propuesta.notaReserva.travesia": "This trek can be booked privately, just for your group, subject to availability.",
      "propuesta.notaReserva.paquete": "The itinerary can be discussed and adapted to the group's needs, whenever possible.",
      "propuesta.placeholderNotice": "⚠️ This is a sample listing, included only to show how the detail page works. Replace this content with the real thing before publishing.",
      "propuesta.whatsappTour": 'Hi, I\'d like to ask about the Tour "{{nombre}}".',
      "propuesta.whatsappTravesia": 'Hi, I\'d like to ask about the Trek "{{nombre}}".',

      /* ---------- Detail (aside / type-specific blocks) ---------- */
      "detalle.duracion": "Duration",
      "detalle.modalidad": "Format",
      "detalle.dificultad": "Difficulty",
      "detalle.fecha": "Date",
      "detalle.salida": "Departure",
      "detalle.regreso": "Return",
      "detalle.fechas": "Dates",
      "detalle.recorrido": "Route",
      "detalle.itinerario": "Itinerary",
      "detalle.dia": "Day",
      "detalle.personalizable": "Customizable",
      "detalle.logisticaNoIncluida": "What logistics don't cover",
      "detalle.actividadesIncluidas": "Included activities",
      "detalle.toursIncluidos": "Tours included in this package",
      "detalle.travesiasIncluidas": "Treks included in this package",
      "detalle.combinable": "This tour can be combined with other tours.",
      "detalle.combinableConvierte": " When combined, the trip becomes a multi-day trek.",

      /* ---------- Team ---------- */
      "equipo.parteDelEquipo": ", part of the Proyecto Raíces team",

      /* ---------- Default WhatsApp / mailto ---------- */
      "whatsapp.mensajeDefault": "Hi, I'd like to ask about a Proyecto Raíces experience.",
      "mailto.asuntoDefault": "Website inquiry",

      /* ---------- Static page metadata (title, meta description, alt) ---------- */
      "meta.home.title": "Proyecto Raíces — Adventure tourism in Argentina and Peru",
      "meta.experiencias.title": "Experiences — Proyecto Raíces",
      "meta.destinos.title": "Destinations — Proyecto Raíces",
      "meta.destino.title": "Destination — Proyecto Raíces",
      "meta.tours.title": "Tours — Proyecto Raíces",
      "meta.travesias.title": "Treks — Proyecto Raíces",
      "meta.paquetes.title": "Packages — Proyecto Raíces",
      "meta.propuesta.title": "Listing — Proyecto Raíces",
      "meta.nosotros.title": "About us — Proyecto Raíces",
      "meta.galeria.title": "Gallery — Proyecto Raíces",
      "meta.comentarios.title": "Reviews — Proyecto Raíces",
      "meta.contacto.title": "Contact — Proyecto Raíces",
      "meta.home.desc": "Proyecto Raíces creates and selects unique travel experiences to connect people with destinations, cultures and moments that last forever. Trekking, camping and guided trips in Argentina and Peru.",
      "meta.experiencias.desc": "Proyecto Raíces tours, treks and packages in one place: choose your next adventure in Argentina and Peru.",
      "meta.destinos.desc": "Discover Proyecto Raíces destinations: Bariloche, Ushuaia, San Martín de los Andes, Villa Pehuenia and Norte Neuquino in Argentina, and Cusco (Peru) internationally.",
      "meta.destino.desc": "Get to know each Proyecto Raíces destination: the character of the place, real photos and the experiences available there.",
      "meta.tours.desc": "Half-day and full-day Proyecto Raíces tours: guided trekking, camping and nature activities in Argentina and Peru.",
      "meta.travesias.desc": "Multi-day Proyecto Raíces treks: trekking and camping in Argentina and Peru.",
      "meta.paquetes.desc": "All-inclusive Proyecto Raíces travel packages in Argentina and Peru, with personalized attention from start to finish.",
      "meta.propuesta.desc": "Details of a Proyecto Raíces adventure tourism tour, trek or package.",
      "meta.nosotros.desc": "Get to know Proyecto Raíces: who we are, our value proposition and how we create travel experiences in Argentina and Peru.",
      "meta.galeria.desc": "Photo gallery of Proyecto Raíces experiences and departures in Argentina and Peru.",
      "meta.comentarios.desc": "What travelers who have already had an experience with Proyecto Raíces say.",
      "meta.contacto.desc": "Get in touch with Proyecto Raíces to check availability, plan a custom trip or ask about our experiences in Argentina and Peru.",
      "alt.home.hero": "Lake and mountains of the Cordillera, one of the landscapes that connects Proyecto Raíces",
      "alt.home.tours": "Tours",
      "alt.home.travesias": "Treks",
      "alt.home.paquetes": "Packages",
      "alt.home.quienesSomos": "Photo of Proyecto Raíces at one of our destinations",
      "alt.nosotros.hero": "A woman from Cusco sharing her craft, part of the communities we work with",
      "alt.nosotros.historia": "Walking toward an Inca citadel among the mountains, the slow pace that defines every trip",
      "alt.paquetes.hero": "Traveler with open arms in front of Machu Picchu, enjoying a trip arranged from start to finish",
      "alt.tours.hero": "Walking through an Andean crafts market, a real travel experience",
      "alt.tours.intro": "Local life on a street in Cusco, part of the tour experience",
      "alt.travesias.hero": "Wide view of Patagonian lakes and mountains, the landscape covered over several days",
      "alt.travesias.intro": "Llamas in front of snow-capped peaks in the mountain range, protagonists of the trail"
    }
  };

  /* ---------- Enums de Supabase con pocos valores fijos ----------
     destinos.pais, experiencias.modalidad, experiencias.duracion y
     detalle.dificultad no
     tienen columna "_en" (serían decenas de filas repitiendo apenas
     2–7 valores reales): se traducen acá, una sola vez por valor real,
     y el resto del sitio los resuelve con I18N.translateEnum() en vez
     de comparar/traducir el string donde se imprime. Un valor real no
     contemplado (dato nuevo cargado en Supabase) se muestra tal cual
     viene, en español, en vez de undefined. */
  const enumMaps = {
    pais: {
      "Argentina": "Argentina",
      "Perú": "Peru"
    },
    modalidad: {
      "Salida grupal": "Group departure",
      "Servicio compartido": "Shared service",
      "Servicio privado": "Private service",
      "Salida con reserva previa": "Departure by reservation",
      "Paquete a medida": "Custom package"
    },
    // Duración: valores fijos ("Medio día", "Día completo") y el patrón
    // "N días / M noches" (también "N días" solo), conservando los
    // números tal cual; "3 h", "3–4 h", etc. ya son iguales en inglés.
    duracion: (v) => {
      if (v === "Medio día") return "Half day";
      if (v === "Día completo") return "Full day";
      const m = /^(\d+) días?(?: \/ (\d+) noches?)?$/.exec(v);
      if (!m) return v;
      const dias = `${m[1]} ${m[1] === "1" ? "day" : "days"}`;
      return m[2] ? `${dias} / ${m[2]} ${m[2] === "1" ? "night" : "nights"}` : dias;
    },
    dificultad: {
      "Alta": "High",
      "Media": "Medium",
      "Media +": "Medium +",
      "Baja": "Low",
      "Baja +": "Low +",
      "Moderada": "Moderate",
      "Moderada/alta": "Moderate/high"
    }
  };

  function translateEnum(categoria, valor){
    if (!valor) return valor;
    if (currentLang !== "en") return valor;
    const mapa = enumMaps[categoria];
    if (!mapa) return valor;
    if (typeof mapa === "function") return mapa(valor);
    return mapa[valor] || valor;
  }

  function getLang(){
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "es" || saved === "en") return saved;
    } catch (e) { /* localStorage no disponible (modo privado, etc.) */ }
    return DEFAULT_LANG;
  }

  const currentLang = getLang();

  function t(key, vars){
    const table = dict[currentLang] || dict[DEFAULT_LANG];
    let str = Object.prototype.hasOwnProperty.call(table, key) ? table[key] : dict[DEFAULT_LANG][key];
    if (str === undefined) return key;
    if (vars) {
      Object.keys(vars).forEach(k => {
        str = str.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), vars[k]);
      });
    }
    return str;
  }

  function applyTo(root){
    const scope = root || document;
    scope.querySelectorAll("[data-i18n]").forEach(el => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    scope.querySelectorAll("[data-i18n-html]").forEach(el => {
      el.innerHTML = t(el.getAttribute("data-i18n-html"));
    });
    scope.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
    });
    scope.querySelectorAll("[data-i18n-aria-label]").forEach(el => {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria-label")));
    });
    scope.querySelectorAll("[data-i18n-alt]").forEach(el => {
      el.setAttribute("alt", t(el.getAttribute("data-i18n-alt")));
    });
    scope.querySelectorAll("[data-i18n-content]").forEach(el => {
      el.setAttribute("content", t(el.getAttribute("data-i18n-content")));
    });
    scope.querySelectorAll("[data-i18n-title]").forEach(el => {
      el.setAttribute("title", t(el.getAttribute("data-i18n-title")));
    });
  }

  function setLang(lang){
    if (lang !== "es" && lang !== "en") return;
    try { window.localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* no-op sin localStorage */ }
    if (lang === currentLang) return;
    window.location.reload();
  }

  function initSwitcher(){
    document.querySelectorAll(".lang-btn").forEach(btn => {
      const lang = btn.getAttribute("data-lang");
      const isActive = lang === currentLang;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
      btn.addEventListener("click", () => setLang(lang));
    });
  }

  document.documentElement.setAttribute("lang", currentLang);
  applyTo(document);
  initSwitcher();

  return { t, lang: currentLang, getLang, setLang, applyTo, translateEnum };
})();
