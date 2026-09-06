/* =========================================================
   DESTINOS — PROYECTO RAÍCES
   Para agregar un destino nuevo, copiá un objeto del array
   y completá sus datos. "imagen" puede quedar en null si
   todavía no hay foto: se mostrará un placeholder prolijo.

   "esPlaceholder" describe el propio destino (su foto/resumen
   todavía no están cargados/terminados) — NO dice si el lugar
   existe ni si puede tener experiencias reales y publicadas.
   Un destino con esPlaceholder:true puede perfectamente tener
   propuestas reales con publicado:true (ver propuestas-data.js);
   ese es el caso de Choquequirao. No usar esPlaceholder para
   decidir si una propuesta puede publicarse — ese criterio vive
   sólo en "publicado", dentro de cada propuesta.

   "region" (opcional) agrupa destinos que pertenecen a una misma
   región/departamento (hoy sólo "Cusco" y "Choquequirao" comparten
   region:"Cusco"). Es metadata descriptiva: hoy ningún render la
   usa todavía, así que agregarla no cambia ningún comportamiento;
   queda disponible para cuando se necesite una jerarquía
   País → Región → Destino más adelante, sin forzarla ahora en
   destinos que no la necesitan.

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
    slug: "cusco",
    nombre: "Cusco",
    pais: "Perú",
    region: "Cusco",
    grupo: "internacional",
    imagen: "assets/img/destino-peru-machupicchu.jpg",
    resumen: "Ciudadelas incas, picos nevados y desiertos que parecen de otro planeta.",
    esPlaceholder: false
  },

  /* ---------------------------------------------------------
     Perú — Choquequirao (Región Cusco), Paracas, Huacachina,
     Arequipa y Lima. Choquequirao es un destino/atractivo propio,
     independiente de la ciudad de Cusco (no una actividad dentro
     de Cusco): ya tiene foto y resumen reales, y ya tiene una
     propuesta real y publicada (Choquequirao Trekking, ver
     propuestas-data.js) — esPlaceholder:true acá sólo indica que
     la ficha del destino en sí (foto/resumen) sigue siendo mínima,
     no que el lugar o sus experiencias no sean reales.
     Paracas/Huacachina/Arequipa/Lima, en cambio, todavía no tienen
     foto ("imagen: null") ni ninguna propuesta cargada, así que su
     "resumen" dice eso mismo en vez de inventar una descripción.
     Reemplazar "imagen" y "resumen" por los reales apenas estén
     disponibles; no hace falta tocar nada más.
     --------------------------------------------------------- */
  {
    slug: "choquequirao",
    nombre: "Choquequirao",
    pais: "Perú",
    region: "Cusco",
    grupo: "internacional",
    imagen: "assets/img/experiencias/pexels-teresita-ramirez-583628649-17043331.jpg",
    resumen: "La ciudad inca hermana de Machupicchu, cruzando el Cañón del Apurímac: trekking exigente entre pasos de montaña, bosques nublados y valles verdes.",
    esPlaceholder: true
  },
  {
    slug: "paracas",
    nombre: "Paracas",
    pais: "Perú",
    grupo: "internacional",
    imagen: null,
    resumen: "Todavía no tenemos información cargada de este destino.",
    esPlaceholder: true
  },
  {
    slug: "huacachina",
    nombre: "Huacachina",
    pais: "Perú",
    grupo: "internacional",
    imagen: null,
    resumen: "Todavía no tenemos información cargada de este destino.",
    esPlaceholder: true
  },
  {
    slug: "arequipa",
    nombre: "Arequipa",
    pais: "Perú",
    grupo: "internacional",
    imagen: null,
    resumen: "Todavía no tenemos información cargada de este destino.",
    esPlaceholder: true
  },
  {
    slug: "lima",
    nombre: "Lima",
    pais: "Perú",
    grupo: "internacional",
    imagen: null,
    resumen: "Todavía no tenemos información cargada de este destino.",
    esPlaceholder: true
  }
];

function getDestinoPorSlug(slug){
  return DESTINOS.find(d => d.slug === slug);
}

/* Orden reutilizable para cualquier listado/carrusel de destinos: los
   "Próximamente" (esPlaceholder) siempre al final, sin mezclarse con
   los disponibles — sort() es estable, así que dentro de cada grupo se
   conserva el orden ya definido arriba en DESTINOS. */
function ordenarDestinos(lista){
  return lista.slice().sort((a, b) => (a.esPlaceholder === b.esPlaceholder) ? 0 : a.esPlaceholder ? 1 : -1);
}
