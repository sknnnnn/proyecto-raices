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
  }
];

function getDestinoPorSlug(slug){
  return DESTINOS.find(d => d.slug === slug);
}
