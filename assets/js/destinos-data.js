/* =========================================================
   DESTINOS — PROYECTO RAÍCES
   Para agregar un destino nuevo, copiá un objeto del array
   y completá sus datos. "imagen" puede quedar en null si
   todavía no hay foto: se mostrará un placeholder prolijo.

   Buenos Aires se sacó de esta lista: ya no se ofrece como
   destino. Si en algún momento vuelve a ofrecerse, alcanza
   con agregar de nuevo su objeto (imagen de referencia:
   assets/img/destino-buenos-aires.jpg, que se conservó).

   "Patagonia" ya no es un destino: agrupaba experiencias reales
   de lugares distintos (Ushuaia, Bariloche, San Martín de los
   Andes, Villa Pehuenia, Norte Neuquino), que ahora son destinos
   propios. "Patagonia" sigue siendo válida como referencia
   geográfica en textos, pero no como destino navegable.
   ========================================================= */

const DESTINOS = [
  {
    slug: "bariloche",
    nombre: "Bariloche",
    pais: "Argentina",
    grupo: "argentina",
    imagen: "assets/img/destino-patagonia.jpg",
    resumen: "Lagos de un celeste imposible, bosques nativos y montañas que se recorren a pie o en bicicleta.",
    esPlaceholder: false
  },
  {
    slug: "ushuaia",
    nombre: "Ushuaia",
    pais: "Argentina",
    grupo: "argentina",
    imagen: "assets/img/galeria-ushuaia.jpg",
    resumen: "El fin del mundo: canales, glaciares y trekking en Tierra del Fuego.",
    esPlaceholder: false
  },
  {
    slug: "san-martin-de-los-andes",
    nombre: "San Martín de los Andes",
    pais: "Argentina",
    grupo: "argentina",
    imagen: "assets/img/experiencias/Cerro Capilla.jpg",
    resumen: "Puerta de entrada a la cordillera y a los cruces en e-bike hacia Chile.",
    esPlaceholder: false
  },
  {
    slug: "villa-pehuenia",
    nombre: "Villa Pehuenia",
    pais: "Argentina",
    grupo: "argentina",
    imagen: "assets/img/patagonia.jpg",
    resumen: "Bosques de araucarias milenarias entre volcanes y lagos del norte neuquino.",
    esPlaceholder: false
  },
  {
    slug: "norte-neuquino",
    nombre: "Norte Neuquino",
    pais: "Argentina",
    grupo: "argentina",
    imagen: "assets/img/trekking.jpg",
    resumen: "Volcanes, aguas termales y valles glaciares en el techo de la Patagonia.",
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
