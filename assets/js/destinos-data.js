/* =========================================================
   DESTINOS — PROYECTO RAÍCES
   Para agregar un destino nuevo, copiá un objeto del array
   y completá sus datos. "imagen" puede quedar en null si
   todavía no hay foto: se mostrará un placeholder prolijo.

   Buenos Aires se sacó de esta lista: ya no se ofrece como
   destino. Si en algún momento vuelve a ofrecerse, alcanza
   con agregar de nuevo su objeto (imagen de referencia:
   assets/img/destino-buenos-aires.jpg, que se conservó).
   ========================================================= */

const DESTINOS = [
  {
    slug: "patagonia",
    nombre: "Patagonia",
    pais: "Argentina",
    grupo: "argentina",
    imagen: "assets/img/destino-patagonia.jpg",
    resumen: "Lagos de un celeste imposible, bosques nativos y montañas que se recorren a pie.",
    esPlaceholder: false
  },
  {
    slug: "norte-argentino",
    nombre: "Norte Argentino",
    pais: "Argentina",
    grupo: "argentina",
    imagen: "assets/img/destino-norte-argentino.jpg",
    resumen: "Cerros de colores, pueblos con historia y una cultura andina que sigue viva.",
    esPlaceholder: true
  },
  {
    slug: "peru",
    nombre: "Perú",
    pais: "Perú",
    grupo: "internacional",
    imagen: "assets/img/destino-peru-machupicchu.jpg",
    resumen: "Ciudadelas incas, picos nevados y desiertos que parecen de otro planeta.",
    esPlaceholder: false
  },

  /* ---------------------------------------------------------
     Perú — Choquequirao, Paracas, Huacachina, Arequipa y Lima.
     TEMPORAL: todavía no hay fotos reales de estos 5 destinos,
     así que "imagen" apunta por ahora a fotos de Bariloche
     (subidas para otro fin) sólo para poder ver la estructura y
     el diseño del carrusel de Perú. "resumen" no describe el
     destino real (no hay info cargada todavía) — es un aviso
     genérico, igual que el resto del sitio marca contenido de
     ejemplo. Reemplazar "imagen" y "resumen" por los reales
     apenas estén disponibles; no hace falta tocar nada más.
     --------------------------------------------------------- */
  {
    slug: "choquequirao",
    nombre: "Choquequirao",
    pais: "Perú",
    grupo: "internacional",
    imagen: "assets/img/Refugio Frey base.jpg",
    resumen: "Contenido de ejemplo — información real próximamente.",
    esPlaceholder: true
  },
  {
    slug: "paracas",
    nombre: "Paracas",
    pais: "Perú",
    grupo: "internacional",
    imagen: "assets/img/San Carlos de Bariloche desde Brazo Huemul.jpg",
    resumen: "Contenido de ejemplo — información real próximamente.",
    esPlaceholder: true
  },
  {
    slug: "huacachina",
    nombre: "Huacachina",
    pais: "Perú",
    grupo: "internacional",
    imagen: "assets/img/Valle del Manso.jpeg",
    resumen: "Contenido de ejemplo — información real próximamente.",
    esPlaceholder: true
  },
  {
    slug: "arequipa",
    nombre: "Arequipa",
    pais: "Perú",
    grupo: "internacional",
    imagen: "assets/img/circuito chico - .jpeg",
    resumen: "Contenido de ejemplo — información real próximamente.",
    esPlaceholder: true
  },
  {
    slug: "lima",
    nombre: "Lima",
    pais: "Perú",
    grupo: "internacional",
    imagen: "assets/img/Brazo tristeza.jpg",
    resumen: "Contenido de ejemplo — información real próximamente.",
    esPlaceholder: true
  }
];

function getDestinoPorSlug(slug){
  return DESTINOS.find(d => d.slug === slug);
}
