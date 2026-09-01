/* =========================================================
   PROPUESTAS — PROYECTO RAÍCES
   ---------------------------------------------------------
   Cada propuesta tiene:

   1) CAMPOS COMUNES (todos los tipos los tienen):
      id, esPlaceholder, tipo, nombre, destino, categoria,
      imagen, galeria, resumen, descripcion, incluye, noIncluye,
      duracion, modalidad, ubicacion, infoImportante, destacada,
      precio

   2) UN OBJETO "detalle" con los campos ESPECÍFICOS del tipo
      (sólo los que correspondan a ese tipo — no hace falta
      completar campos que no apliquen).

        tipo: "tour"      → detalle: ver TOUR_DETALLE_CAMPOS
        tipo: "travesia"  → detalle: ver TRAVESIA_DETALLE_CAMPOS
        tipo: "paquete"   → detalle: ver PAQUETE_DETALLE_CAMPOS

   Guardar lo específico de cada tipo adentro de "detalle" (en
   vez de mezclarlo todo en un único objeto plano) es lo que
   permite que un Tour no tenga que cargar campos de Travesía
   o Paquete, y viceversa. propuesta.html lee el "tipo" y arma
   la ficha automáticamente a partir de "detalle".

   ---------------------------------------------------------
   CAMPOS ESPECÍFICOS POR TIPO (todos son opcionales: si un
   campo no aplica, se puede omitir directamente del objeto
   "detalle" o dejarlo en null/[] — el render se lo salta).

   TOUR (actividad de un solo día):
     - fecha                        string | null
     - horario                      string | null
     - puntoDeEncuentro             string | null
     - combinableConOtrosTours      boolean
     - seConvierteEnTravesiaAlCombinar boolean
     - duracionCombinada            string | null   (si se combina)
     - itinerarioCombinado          array de string | null (si se combina)

   TRAVESÍA (varios días, personalizable):
     - dificultad                   string | null
     - fechas                       array de string  (fechas/salidas disponibles)
     - itinerario                   array de { dia, titulo, descripcion }
     - alojamiento                  string | null
     - comidas                      string | null
     - personalizable               boolean
     - logisticaNoIncluida          array de string
         (para dejar explícito qué NO cubre la travesía:
          vuelo hasta destino, traslado aeropuerto↔hotel,
          alojamiento previo/posterior, etc. — no todas las
          travesías van a tener la misma lista)

   PAQUETE (viaje integral, personalizable):
     - transporte                   string | null
     - vuelos                       string | null
     - traslados                    string | null
     - alojamiento                  string | null
     - comidas                      string | null
     - toursIncluidos               array de "id" de PROPUESTAS (tipo tour)
     - travesiasIncluidas           array de "id" de PROPUESTAS (tipo travesia)
     - actividades                  array de string
     - itinerario                   array de { dia, titulo, descripcion }
     - personalizable               boolean

   ---------------------------------------------------------
   Para agregar una propuesta nueva:
   1. Copiá uno de los objetos del array PROPUESTAS (el que
      más se parezca al tipo que vas a cargar).
   2. Cambiá el "id" por uno nuevo, único y sin espacios
      (se usa en la URL: propuesta.html?id=tu-id).
   3. Completá los campos comunes.
   4. Completá SOLO los campos de "detalle" que correspondan
      a ese tipo (podés borrar los que no uses).
   5. Poné "esPlaceholder: false" cuando el contenido sea real.
   No hace falta tocar ningún otro archivo ni crear una página
   HTML nueva: tours.html / travesias.html / paquetes.html /
   catalogo.html / propuesta.html se arman solas a partir de
   esta lista.
   ========================================================= */

const TIPOS_PROPUESTA = {
  tour:     { label: "Tour",     labelPlural: "Tours",      pagina: "tours.html" },
  travesia: { label: "Travesía", labelPlural: "Travesías",  pagina: "travesias.html" },
  paquete:  { label: "Paquete",  labelPlural: "Paquetes",   pagina: "paquetes.html" }
};

const PROPUESTAS = [

  /* ---------------- TOUR (ejemplo) ---------------- */
  {
    id: "trekking-patagonia-ejemplo",
    esPlaceholder: true,
    tipo: "tour",
    nombre: "[Ejemplo] Trekking en Patagonia",
    destino: "patagonia",       // debe coincidir con un "slug" de destinos-data.js
    categoria: "Trekking",
    imagen: "assets/img/trekking.jpg",
    galeria: ["assets/img/trekking.jpg", "assets/img/vista-lago.jpg"],
    resumen: "Descripción breve de ejemplo. Reemplazar por la bajada real de la propuesta (1-2 líneas).",
    descripcion: "Texto de ejemplo. Acá va la descripción completa y real de la propuesta: el recorrido, el paisaje, el tipo de grupo, el nivel de dificultad y todo lo que ayude a la persona a decidir.",
    incluye: ["[Completar] Ítem incluido 1", "[Completar] Ítem incluido 2", "[Completar] Ítem incluido 3"],
    noIncluye: ["[Completar] Ítem no incluido 1", "[Completar] Ítem no incluido 2"],
    duracion: "[Completar] · un día",
    modalidad: "Salida grupal",
    ubicacion: "Patagonia, Argentina",
    infoImportante: "Texto de ejemplo para recomendaciones o información importante (nivel físico requerido, qué llevar, edad mínima, etc.).",
    precio: null,
    destacada: true,

    detalle: {
      fecha: null,                        // ej: "14 de septiembre" — null si es a demanda
      horario: "[Completar] ej. 8:00 a 18:00",
      puntoDeEncuentro: "[Completar] punto de encuentro",
      combinableConOtrosTours: false,
      seConvierteEnTravesiaAlCombinar: false,
      duracionCombinada: null,
      itinerarioCombinado: []
    }
  },

  /* ---------------- TRAVESÍA (ejemplo) ---------------- */
  {
    id: "camping-patagonia-ejemplo",
    esPlaceholder: true,
    tipo: "travesia",
    nombre: "[Ejemplo] Camping & naturaleza",
    destino: "patagonia",
    categoria: "Camping",
    imagen: "assets/img/IMG_0270.JPEG",
    galeria: ["assets/img/IMG_0270.JPEG", "assets/img/fauna-montana.jpg"],
    resumen: "Descripción breve de ejemplo. Reemplazar por la bajada real de la propuesta.",
    descripcion: "Texto de ejemplo. Acá va la descripción completa y real de la travesía de camping: ubicación, entorno, actividades incluidas y dinámica del grupo a lo largo de los días.",
    incluye: ["[Completar] Ítem incluido 1", "[Completar] Ítem incluido 2"],
    noIncluye: ["[Completar] Ítem no incluido 1"],
    duracion: "[Completar] · varios días",
    modalidad: "Salida grupal",
    ubicacion: "Patagonia, Argentina",
    infoImportante: "Texto de ejemplo para recomendaciones o información importante.",
    precio: null,
    destacada: true,

    detalle: {
      dificultad: "[Completar] ej. Media",
      fechas: [],                          // ej: ["12 oct", "9 nov"]
      itinerario: [
        { dia: 1, titulo: "[Completar] título del día 1", descripcion: "[Completar] descripción del día 1" },
        { dia: 2, titulo: "[Completar] título del día 2", descripcion: "[Completar] descripción del día 2" }
      ],
      alojamiento: "[Completar] ej. Camping equipado",
      comidas: "[Completar] ej. Desayuno y cena incluidos",
      personalizable: true,
      logisticaNoIncluida: [
        "Vuelo hasta el destino",
        "Traslado aeropuerto → hotel",
        "Traslado hotel → punto de encuentro",
        "Alojamiento previo o posterior a la travesía",
        "Traslado de regreso al aeropuerto"
      ]
    }
  },

  /* ---------------- PAQUETE (ejemplo) ---------------- */
  {
    id: "andes-peru-ejemplo",
    esPlaceholder: true,
    tipo: "paquete",
    nombre: "[Ejemplo] Ruta andina integral",
    destino: "peru",
    categoria: "Cultura & altura",
    imagen: "assets/img/0789c7b1-125a-4bad-8f3a-576c36622000.jpeg",
    galeria: ["assets/img/0789c7b1-125a-4bad-8f3a-576c36622000.jpeg"],
    resumen: "Descripción breve de ejemplo. Reemplazar por la bajada real de la propuesta.",
    descripcion: "Texto de ejemplo. Acá va la descripción completa y real del paquete en Perú: valles, comunidades locales, altura, cultura andina y todo lo que incluye el viaje integral.",
    incluye: ["[Completar] Ítem incluido 1", "[Completar] Ítem incluido 2"],
    noIncluye: ["[Completar] Ítem no incluido 1"],
    duracion: "[Completar] · viaje integral",
    modalidad: "Paquete a medida",
    ubicacion: "Perú",
    infoImportante: "Texto de ejemplo sobre aclimatación a la altura y recomendaciones.",
    precio: null,
    destacada: false,

    detalle: {
      transporte: "[Completar] ej. Bus turístico entre ciudades",
      vuelos: "[Completar] ej. No incluidos",
      traslados: "[Completar] ej. Aeropuerto ↔ hotel incluidos",
      alojamiento: "[Completar] ej. Hoteles 3★ en cada ciudad",
      comidas: "[Completar] ej. Desayuno incluido",
      // ids de PROPUESTAS que este paquete integra (deben existir en este mismo array):
      toursIncluidos: [],
      travesiasIncluidas: [],
      actividades: ["[Completar] actividad 1", "[Completar] actividad 2"],
      itinerario: [
        { dia: 1, titulo: "[Completar] título del día 1", descripcion: "[Completar] descripción del día 1" }
      ],
      personalizable: true
    }
  }
];

function getPropuestaPorId(id){
  return PROPUESTAS.find(p => p.id === id);
}

function getPropuestasPorTipo(tipo){
  return PROPUESTAS.filter(p => p.tipo === tipo);
}

function getPropuestasPorDestino(slug){
  return PROPUESTAS.filter(p => p.destino === slug);
}

function getCategorias(lista){
  const base = lista || PROPUESTAS;
  return [...new Set(base.map(p => p.categoria))];
}
