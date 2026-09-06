/* =========================================================
   PROPUESTAS — PROYECTO RAÍCES
   ---------------------------------------------------------
   Cada propuesta tiene:

   1) CAMPOS COMUNES (todos los tipos los tienen):
      id, esPlaceholder, publicado, tipo, nombre, destino, categoria,
      imagen, galeria, resumen, descripcion, incluye, noIncluye,
      duracion, modalidad, ubicacion, infoImportante, destacada,
      precio

      "esPlaceholder" y "publicado" son dos cosas distintas:
      - esPlaceholder: el contenido es de ejemplo/plantilla (no una
        propuesta real todavía).
      - publicado: puede aparecer en Home, catálogos, filtros y
        fichas (superficies públicas). "esPlaceholder: false" NO
        implica "publicado: true" — cargar los datos reales de una
        propuesta es necesario pero no alcanza para publicarla; la
        decisión de publicar es explícita.
      Si no estás seguro de que una propuesta esté lista para
      producción, dejá "publicado: false".

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
     - distanciaTotal               string | null
     - fechas                       array de string  (fechas/salidas disponibles, formato compacto)
     - fechasNota                   string | null  (aclaración corta, ej. "A confirmar")
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
   6. Poné "publicado: true" recién cuando esa propuesta esté lista
      para mostrarse en producción (no antes, y no sólo porque
      esPlaceholder sea false).
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

  /* ---------------- TOURS — CUSCO / PERÚ ---------------- */
  {
    id: "cusco-city-tour",
    esPlaceholder: false,
    publicado: true,
    tipo: "tour",
    nombre: "City Tour — Guía 2 idiomas",
    destino: "cusco",
    categoria: "City tour",
    imagen: "assets/img/pexels-danitza-pena-galup-8100091-18143706.jpg",
    galeria: ["assets/img/pexels-danitza-pena-galup-8100091-18143706.jpg", "assets/img/experiencias/pexels-suca-19852367.jpg"],
    resumen: "Recorrido por Qoricancha, Sacsayhuamán, Qenqo, Puca Pucara y Tambomachay, con guía en dos idiomas.",
    descripcion: "Un recorrido por los sitios arqueológicos e históricos más importantes de Cusco: el Templo del Qoricancha, la fortaleza de Sacsayhuamán, y los conjuntos incas de Qenqo, Puca Pucara y Tambomachay.",
    incluye: ["Bus turístico", "Guía profesional", "Boleto turístico", "Ingreso a Qoricancha"],
    noIncluye: [],
    duracion: "Medio día",
    modalidad: "Salida grupal",
    ubicacion: "Cusco, Perú",
    infoImportante: null,
    precio: null,
    destacada: false,
    detalle: {
      fecha: null,
      dificultad: null,
      distancia: null,
      desnivel: null,
      salida: "8:30 o 12:30",
      regreso: "14:30 o 18:30",
      puntoDeEncuentro: null,
      combinableConOtrosTours: false,
      seConvierteEnTravesiaAlCombinar: false,
      duracionCombinada: null,
      itinerarioCombinado: [],
      recorrido: ["Templo del Qoricancha", "Sacsayhuamán", "Qenqo", "Puca Pucara", "Tambomachay"]
    }
  },
  {
    id: "cusco-mirabus",
    esPlaceholder: false,
    publicado: true,
    tipo: "tour",
    nombre: "Tour Mirabus — Bus Panorámico",
    destino: "cusco",
    categoria: "Bus panorámico",
    imagen: "assets/img/experiencias/pexels-julia-volk-5198292.jpg",
    imagenPos: "center 78%",
    galeria: ["assets/img/experiencias/pexels-julia-volk-5198292.jpg", "assets/img/experiencias/pexels-roberto-carlos-yarahuaman-layme-807858060-27937625.jpg"],
    resumen: "Bus panorámico por el Centro Histórico de Cusco y los sitios arqueológicos cercanos, con salidas cada hora.",
    descripcion: "En bus panorámico, este tour recorre el Centro Histórico de Cusco y sus alrededores: el Qorikancha, el Palacio de Colcampata, el Templo de San Cristóbal, Sacsayhuamán, Qenqo y Puca Pucará, con una parada en un centro de rituales incas para una lectura de hoja de coca y cierre en el mirador del Cristo Blanco.",
    incluye: [],
    noIncluye: [],
    duracion: "Medio día",
    modalidad: "Salida grupal",
    ubicacion: "Cusco, Perú",
    infoImportante: null,
    precio: null,
    destacada: false,
    detalle: {
      fecha: null,
      dificultad: null,
      distancia: null,
      desnivel: null,
      salida: "Cada hora desde las 9:00 AM",
      regreso: null,
      puntoDeEncuentro: "Pileta Plaza de Armas",
      combinableConOtrosTours: false,
      seConvierteEnTravesiaAlCombinar: false,
      duracionCombinada: null,
      itinerarioCombinado: [],
      recorrido: ["Centro Histórico de Cusco", "Qorikancha", "Palacio de Colcampata", "Templo de San Cristóbal", "Sacsayhuaman", "Qenqo", "Puca Pucará", "Centro de Rituales Incas, lectura a hoja de coca", "Mirador Cristo Blanco", "Regreso a Cusco"]
    }
  },
  {
    id: "cusco-valle-sagrado",
    esPlaceholder: false,
    publicado: true,
    tipo: "tour",
    nombre: "Tour Valle Sagrado",
    destino: "cusco",
    categoria: "Valle Sagrado",
    imagen: "assets/img/_DSC0144.jpg",
    galeria: ["assets/img/_DSC0144.jpg", "assets/img/galeria-cusco-calle.jpg"],
    resumen: "Servicio compartido guiado en dos idiomas por Pisac, Urubamba y la fortaleza de Ollantaytambo.",
    descripcion: "Un recorrido guiado por el Valle Sagrado que combina historia y paisaje: el sitio arqueológico y el mercado de Pisac, un almuerzo en Urubamba, la fortaleza de Ollantaytambo y el regreso a Cusco pasando por Chincheros.",
    incluye: ["Transporte turístico", "Guía profesional", "Boleto turístico"],
    noIncluye: [],
    duracion: "Día completo",
    modalidad: "Servicio compartido",
    ubicacion: "Cusco, Perú",
    infoImportante: null,
    precio: null,
    destacada: false,
    detalle: {
      fecha: null,
      dificultad: null,
      distancia: null,
      desnivel: null,
      salida: "7:20 a.m.",
      regreso: null,
      puntoDeEncuentro: null,
      combinableConOtrosTours: false,
      seConvierteEnTravesiaAlCombinar: false,
      duracionCombinada: null,
      itinerarioCombinado: [],
      recorrido: ["Pisac arqueológico + mercado", "Urubamba, almuerzo", "Fortaleza de Ollantaytambo", "Regreso vía Chincheros"]
    }
  },
  {
    id: "cusco-super-valle-sagrado",
    esPlaceholder: false,
    publicado: true,
    tipo: "tour",
    nombre: "Tour Super Valle Sagrado de los Incas",
    destino: "cusco",
    categoria: "Valle Sagrado",
    imagen: "assets/img/experiencias/_DSC0108.jpg",
    galeria: ["assets/img/experiencias/_DSC0108.jpg", "assets/img/experiencias/_DSC0122.jpg", "assets/img/galeria-maras.jpg"],
    resumen: "Servicio compartido guiado en dos idiomas por Chincheros, Moray, las Salineras, Urubamba y Ollantaytambo.",
    descripcion: "Una versión ampliada del recorrido por el Valle Sagrado, con salida antes del amanecer: Chincheros, las terrazas agrícolas de Moray, las Salineras de Maras, un almuerzo en Urubamba, la fortaleza de Ollantaytambo y el regreso a Cusco pasando por Pisac.",
    incluye: ["Bus turístico", "Guía profesional", "Boleto turístico", "Ingreso a Salineras"],
    noIncluye: [],
    duracion: "Día completo",
    modalidad: "Servicio compartido",
    ubicacion: "Cusco, Perú",
    infoImportante: null,
    precio: null,
    destacada: false,
    detalle: {
      fecha: null,
      dificultad: null,
      distancia: null,
      desnivel: null,
      salida: "06:20 am",
      regreso: "19:00",
      puntoDeEncuentro: null,
      combinableConOtrosTours: false,
      seConvierteEnTravesiaAlCombinar: false,
      duracionCombinada: null,
      itinerarioCombinado: [],
      recorrido: ["Chincheros", "Moray", "Salineras", "Urubamba, almuerzo", "Ollantaytambo", "Regreso vía Pisac"]
    }
  },
  {
    id: "cusco-valle-sur",
    esPlaceholder: false,
    publicado: true,
    tipo: "tour",
    nombre: "Tour Valle Sur",
    destino: "cusco",
    categoria: "Valle Sur",
    imagen: "assets/img/hero-nosotros-cusco.jpg",
    galeria: ["assets/img/hero-nosotros-cusco.jpg"],
    resumen: "Servicio compartido guiado en inglés/español por Tipón, Pikillacta y Andahuaylillas.",
    descripcion: "Un recorrido por el Valle Sur de Cusco: los andenes agrícolas de Tipón, el sitio arqueológico de Pikillacta y la iglesia de Andahuaylillas.",
    incluye: ["Bus turístico", "Guía profesional", "Boleto turístico", "Ingreso a Andahuaylillas"],
    noIncluye: [],
    duracion: "Medio día",
    modalidad: "Servicio compartido",
    ubicacion: "Cusco, Perú",
    infoImportante: null,
    precio: null,
    destacada: false,
    detalle: {
      fecha: null,
      dificultad: null,
      distancia: null,
      desnivel: null,
      salida: "08:15–08:30",
      regreso: "15:00",
      puntoDeEncuentro: "Hostal",
      combinableConOtrosTours: false,
      seConvierteEnTravesiaAlCombinar: false,
      duracionCombinada: null,
      itinerarioCombinado: [],
      recorrido: ["Tipón", "Pikillacta", "Andahuaylillas"]
    }
  },
  {
    id: "cusco-maras-moray",
    esPlaceholder: false,
    publicado: true,
    tipo: "tour",
    nombre: "Tour Maras & Moray",
    destino: "cusco",
    categoria: "Valle Sagrado",
    imagen: "assets/img/experiencias/pexels-marco-alhelm-1479977387-32141363.jpg",
    imagenPos: "center 88%",
    galeria: ["assets/img/experiencias/pexels-marco-alhelm-1479977387-32141363.jpg", "assets/img/_DSC0042 (1).jpg"],
    resumen: "Servicio compartido guiado en inglés/español por Chinchero, Maras y Moray.",
    descripcion: "Un recorrido por tres paradas clásicas del Valle Sagrado: Chinchero, con vistas a la cordillera Vilcanota y a los nevados Chicón y La Verónica; las Salineras de Maras, y las terrazas agrícolas de Moray, antiguas plataformas incas de experimentación agrícola donde la diferencia de temperatura entre el andén más alto y el más bajo puede llegar a los 15 °C.",
    incluye: ["Bus turístico", "Guía profesional", "Boleto turístico", "Ingreso a Salineras"],
    noIncluye: [],
    duracion: "Medio día",
    modalidad: "Servicio compartido",
    ubicacion: "Cusco, Perú",
    infoImportante: null,
    precio: null,
    destacada: false,
    detalle: {
      fecha: null,
      dificultad: null,
      distancia: null,
      desnivel: null,
      salida: "8:15–8:30",
      regreso: "15:00",
      puntoDeEncuentro: null,
      combinableConOtrosTours: false,
      seConvierteEnTravesiaAlCombinar: false,
      duracionCombinada: null,
      itinerarioCombinado: [],
      recorrido: ["Chinchero", "Maras", "Moray"]
    }
  },
  {
    id: "cusco-machupicchu-tren",
    esPlaceholder: false,
    publicado: true,
    tipo: "tour",
    nombre: "Machupicchu en un solo día en tren",
    destino: "cusco",
    categoria: "Machu Picchu",
    imagen: "assets/img/experiencias/pexels-sergei-a-1322276-2539417.jpg",
    galeria: ["assets/img/experiencias/pexels-sergei-a-1322276-2539417.jpg", "assets/img/experiencias/pexels-angel-valladares-242487480-17060856.jpg", "assets/img/experiencias/pexels-underxpossed-38263090.jpg", "assets/img/galeria-machupicchu-terrazas.jpg"],
    resumen: "Servicio compartido: traslado a Ollantaytambo, tren a Aguas Calientes y visita guiada a Machu Picchu.",
    descripcion: "Machu Picchu en el día: traslado a Ollantaytambo, tren de Peru Rail hasta Aguas Calientes, bus hasta el Santuario y una visita guiada de aproximadamente 2 horas por la ciudadela, con regreso en bus y tren vía Ollantaytambo hasta Cusco.",
    incluye: ["Tickets de tren", "Bus subida-bajada Aguas Calientes–Machupicchu", "Ingreso a Machupicchu", "Guía profesional", "Transporte Cusco–Ollantaytambo–Cusco"],
    noIncluye: [],
    duracion: "Día completo",
    modalidad: "Servicio compartido",
    ubicacion: "Cusco, Perú",
    infoImportante: null,
    precio: null,
    destacada: true,
    detalle: {
      fecha: null,
      dificultad: null,
      distancia: null,
      desnivel: null,
      salida: "02:30–03:00",
      regreso: null,
      puntoDeEncuentro: null,
      combinableConOtrosTours: false,
      seConvierteEnTravesiaAlCombinar: false,
      duracionCombinada: null,
      itinerarioCombinado: [],
      recorrido: ["Traslado a Ollantaytambo", "Tren Peru Rail 05:05", "Aguas Calientes", "Bus hacia el Santuario", "Visita guiada aproximadamente 2 horas", "Regreso en bus/tren", "Ollantaytambo por la tarde", "Transporte a Cusco"]
    }
  },
  {
    id: "cusco-vinicunca",
    esPlaceholder: false,
    publicado: true,
    tipo: "tour",
    nombre: "Montaña de Colores / Vinicunca 1 día",
    destino: "cusco",
    categoria: "Trekking",
    imagen: "assets/img/experiencias/pexels-teresita-ramirez-583628649-17043331.jpg",
    galeria: ["assets/img/experiencias/pexels-teresita-ramirez-583628649-17043331.jpg"],
    resumen: "Servicio compartido guiado en dos idiomas: caminata hasta Vinicunca (5070 m) y almuerzo buffet.",
    descripcion: "La caminata hasta la Montaña de Colores, con salida temprana desde el hotel: desayuno en Cusipata (3332 m) y ascenso hasta Phulawasipata (4633 m), desde donde una caminata de aproximadamente 1,5 h y 3,5 km —pasando por Wiñayritty y Puca Cocha— lleva hasta Vinicunca (5070 m). Después de un rato libre en la montaña, el regreso incluye un almuerzo buffet en Cusipata.",
    incluye: ["Transporte ida/retorno", "Desayuno/almuerzo buffet", "Guía bilingüe español-inglés", "Ingreso Montaña de Colores S/20 nacional/extranjero"],
    noIncluye: ["Caballos", "Agua y snack"],
    duracion: "Día completo",
    modalidad: "Servicio compartido",
    ubicacion: "Cusco, Perú",
    infoImportante: null,
    precio: null,
    destacada: false,
    detalle: {
      fecha: null,
      dificultad: null,
      distancia: "3,5 km",
      desnivel: null,
      salida: "4:00",
      regreso: "18:00",
      puntoDeEncuentro: "Hotel / hostal",
      combinableConOtrosTours: false,
      seConvierteEnTravesiaAlCombinar: false,
      duracionCombinada: null,
      itinerarioCombinado: [],
      recorrido: ["Cusipata, 3332 m", "Desayuno", "Phulawasipata, 4633 m", "Caminata aproximadamente 1,5 h / 3,50 km", "Wiñayritty", "Puca Cocha", "Vinicunca, 5070 m", "Tiempo libre", "Regreso a Phulawasipata", "Cusipata, almuerzo buffet", "Cusco aproximadamente 18:00"]
    }
  },
  {
    id: "cusco-palcoyo",
    esPlaceholder: false,
    publicado: true,
    tipo: "tour",
    nombre: "Cordillera Arcoíris – Palcoyo",
    destino: "cusco",
    categoria: "Trekking",
    imagen: "assets/img/experiencias/pexels-davidexpedition-30228477.jpg",
    imagenPos: "center 68%",
    galeria: ["assets/img/experiencias/pexels-davidexpedition-30228477.jpg"],
    resumen: "Servicio compartido guiado en dos idiomas hasta el bosque de piedras de Palcoyo (4960 m).",
    descripcion: "Un traslado de aproximadamente 3 horas hasta Combapata (vía Urcos, Cusipata y Checacupe) y un ascenso de una hora llevan hasta el inicio de la caminata, a 4790 m. Desde ahí, el recorrido pasa por Wallata Q'asa, la comunidad de Palcoyo, Warsaqyani y Q'alle Q'alle hasta el bosque de piedras de la Cordillera Arcoíris (4960 m), con tiempo libre antes de bajar.",
    incluye: ["Guía oficial", "Transporte ida/retorno", "Desayuno/almuerzo", "Ingreso Palcoyo"],
    noIncluye: ["Snacks", "Agua"],
    duracion: "Día completo",
    modalidad: "Servicio compartido",
    ubicacion: "Cusco, Perú",
    infoImportante: "Altitud 4700–4850 m. Se recomienda ropa abrigada, snacks, capa para lluvia, anteojos de sol y gorro.",
    precio: null,
    destacada: false,
    detalle: {
      fecha: null,
      dificultad: null,
      distancia: "2 km",
      desnivel: null,
      salida: "04:30–05:00",
      regreso: "18:00–18:30",
      puntoDeEncuentro: null,
      combinableConOtrosTours: false,
      seConvierteEnTravesiaAlCombinar: false,
      duracionCombinada: null,
      itinerarioCombinado: [],
      recorrido: ["Traslado vía Urcos/Cusipata/Checacupe hasta Combapata", "Ascenso hasta el inicio de la caminata, 4790 m", "Wallata Q'asa", "Comunidad de Palcoyo", "Warsaqyani", "Q'alle Q'alle", "Bosque de piedras, 4960 m (aproximadamente 2 km si se asciende hasta ahí)", "Tiempo libre", "Descenso", "Cusipata, almuerzo", "Cusco 18:00–18:30"]
    }
  },
  {
    id: "cusco-valle-rojo-atv",
    esPlaceholder: false,
    publicado: true,
    tipo: "tour",
    nombre: "Montaña de Colores por el Valle Rojo — Ruta Larga en Cuatrimotos",
    destino: "cusco",
    categoria: "Cuatrimotos",
    imagen: "assets/img/galeria-vicunas.jpg",
    galeria: ["assets/img/galeria-vicunas.jpg"],
    resumen: "Ascenso en cuatrimoto por el Valle Rojo hasta la Montaña de Colores, con capacitación incluida.",
    descripcion: "La Montaña de Colores por la ruta del Valle Rojo, en cuatrimoto: 2 horas hasta Cusipata para desayunar y otra hora hasta Laya, donde hay una breve capacitación antes de subir en ATV (unos 40 minutos) por el Valle Rojo. Desde ahí, una caminata de 20 minutos lleva hasta el mirador de la montaña, con tiempo libre antes de bajar de nuevo en cuatrimoto.",
    incluye: ["Transporte turístico ida/retorno", "Guía profesional bilingüe", "Desayuno/almuerzo buffet", "Cuatrimoto/casco", "Botiquín", "Bastón de trekking", "Ingreso montaña"],
    noIncluye: [],
    duracion: "Día completo",
    modalidad: "Servicio compartido",
    ubicacion: "Cusco, Perú",
    infoImportante: null,
    precio: null,
    destacada: false,
    detalle: {
      fecha: null,
      dificultad: null,
      distancia: null,
      desnivel: null,
      salida: "4:00–4:30",
      regreso: "16:00",
      puntoDeEncuentro: null,
      combinableConOtrosTours: false,
      seConvierteEnTravesiaAlCombinar: false,
      duracionCombinada: null,
      itinerarioCombinado: [],
      recorrido: ["2 h hasta Cusipata, desayuno", "1 h hasta Laya", "Cuatrimotos: introducción/capacitación 15 min", "Ascenso en ATV aproximadamente 40 min por Valle Rojo", "Caminata 20 min hasta mirador", "Montaña de Colores, tiempo libre", "Regreso en cuatrimotos", "Cusipata, almuerzo buffet", "Cusco aproximadamente 16:00"]
    }
  },
  {
    id: "cusco-humantay",
    esPlaceholder: false,
    publicado: true,
    tipo: "tour",
    nombre: "Laguna Humantay Full Day",
    destino: "cusco",
    categoria: "Trekking",
    imagen: "assets/img/experiencias/pexels-lyon-17505746.jpg",
    imagenPos: "center 65%",
    galeria: ["assets/img/experiencias/pexels-lyon-17505746.jpg"],
    resumen: "Servicio compartido guiado en dos idiomas hasta la Laguna Humantay (4200 m), al pie del nevado Salkantay.",
    descripcion: "Desayuno en Mollepata (2900 m) y traslado hasta Soraypampa (3900 m), punto de partida de una caminata de aproximadamente una hora hasta la Laguna Humantay (4200 m), a los pies del nevado del mismo nombre (5450 m). El regreso a Soraypampa ofrece vistas hacia la ruta y la montaña Salkantay (6271 m), antes del almuerzo y la vuelta a Cusco.",
    incluye: ["Transporte Cusco–Soraypampa–Cusco", "Desayuno", "Almuerzo", "Guía profesional", "Botiquín", "Ingreso laguna Humantay"],
    noIncluye: ["Bebidas"],
    duracion: "Día completo",
    modalidad: "Servicio compartido",
    ubicacion: "Cusco, Perú",
    infoImportante: null,
    precio: null,
    destacada: false,
    detalle: {
      fecha: null,
      dificultad: null,
      distancia: null,
      desnivel: null,
      salida: "4:15–4:30",
      regreso: null,
      puntoDeEncuentro: null,
      combinableConOtrosTours: false,
      seConvierteEnTravesiaAlCombinar: false,
      duracionCombinada: null,
      itinerarioCombinado: [],
      recorrido: ["Mollepata, 2900 m", "Desayuno", "Soraypampa, 3900 m", "Caminata aproximadamente 1 h", "Laguna Humantay, 4200 m", "Exploración", "Montaña Humantay, 5450 m", "Regreso a Soraypampa", "Ruta Salkantay, montaña Salkantay 6271 m", "Almuerzo", "Regreso a Cusco"]
    }
  },
  {
    id: "cusco-ausangate-7-lagunas",
    esPlaceholder: false,
    publicado: true,
    tipo: "tour",
    nombre: "Circuito de las 7 Lagunas de Ausangate Full Day",
    destino: "cusco",
    categoria: "Trekking",
    imagen: "assets/img/experiencias/pexels-daiji-umemoto-549226763-38917638.jpg",
    imagenPos: "center 60%",
    galeria: ["assets/img/experiencias/pexels-daiji-umemoto-549226763-38917638.jpg"],
    resumen: "Servicio compartido guiado en dos idiomas por el circuito de 7 lagunas junto al nevado Ausangate (6380 m).",
    descripcion: "Un viaje de aproximadamente 3 horas hasta Tinke (3780 m) y 40 minutos más hasta Pacchanta (4310 m), donde se desayuna antes de salir al circuito de las 7 lagunas: unos 6,5 km y 5 horas de caminata pasando por Azulqocha, Otorongo, Alqacocha, Q'omercocha y Patacocha (4740 m), con el nevado Ausangate (6380 m) de fondo y posibilidad de observar fauna andina. El regreso a Pacchanta incluye el almuerzo, con la opción de sumar unas termas.",
    incluye: ["Transporte turístico", "Desayuno/almuerzo buffet", "Guía bilingüe", "Ticket de comunidad", "Ticket de lagunas"],
    noIncluye: ["Caballo adicional", "Termas opcionales", "Snack/agua"],
    duracion: "Día completo",
    modalidad: "Servicio compartido",
    ubicacion: "Cusco, Perú",
    infoImportante: "Altitud 4300–4650 m, con frío. Se recomienda ropa abrigada, snacks, poncho de lluvia, anteojos de sol, protector solar y gorro.",
    precio: null,
    destacada: false,
    detalle: {
      fecha: null,
      dificultad: null,
      distancia: "6,5 km",
      desnivel: null,
      salida: "4:30",
      regreso: "19:30",
      puntoDeEncuentro: null,
      combinableConOtrosTours: false,
      seConvierteEnTravesiaAlCombinar: false,
      duracionCombinada: null,
      itinerarioCombinado: [],
      recorrido: ["Tinke, 3780 m (aproximadamente 3 h)", "Pacchanta, 4310 m (aproximadamente 40 min), desayuno", "Circuito de 7 lagunas, aproximadamente 6,5 km / 5 h", "Azulqocha, Otorongo, Alqacocha, Q'omercocha, Patacocha (4740 m)", "Ausangate, 6380 m — observación de fauna", "Regreso a Pacchanta, almuerzo", "Termas opcionales", "Cusco aproximadamente 19:30"]
    }
  },
  {
    id: "cusco-qeswachaka",
    esPlaceholder: false,
    publicado: true,
    tipo: "tour",
    nombre: "Qeswachaka Full Day",
    destino: "cusco",
    categoria: "Cultura",
    imagen: "assets/img/_DSC0036 (1).jpg",
    galeria: ["assets/img/_DSC0036 (1).jpg"],
    resumen: "Servicio compartido guiado en dos idiomas hasta el último puente colgante inca, tejido en ichu.",
    descripcion: "Un viaje de aproximadamente 2 horas hasta Cusipata (3332 m) para desayunar, seguido de otra hora y media vía Combapata y Yanahoca hasta el puente Qeswachaka, sobre el río Apurímac: un puente colgante inca de unos 28 m, tejido en ichu y reconstruido cada año por las comunidades de Quehue, en Canas. Después de recorrerlo con guía y tomar fotos, el regreso es por la misma ruta, pasando junto a las lagunas de Pampamarca, Asnacqocha, Acopía y Pomacanchi.",
    incluye: ["Transporte ida/retorno", "Desayuno/almuerzo", "Guía bilingüe", "Ticket Queswachaka"],
    noIncluye: ["Agua", "Snack"],
    duracion: "Día completo",
    modalidad: "Servicio compartido",
    ubicacion: "Cusco, Perú",
    infoImportante: null,
    precio: null,
    destacada: false,
    detalle: {
      fecha: null,
      dificultad: null,
      distancia: null,
      desnivel: null,
      salida: "4:30",
      regreso: "17:00",
      puntoDeEncuentro: null,
      combinableConOtrosTours: false,
      seConvierteEnTravesiaAlCombinar: false,
      duracionCombinada: null,
      itinerarioCombinado: [],
      recorrido: ["Cusipata, 3332 m (aproximadamente 2 h), desayuno", "Vía Combapata/Yanahoca hacia Quewe (aproximadamente 1,5 h)", "Puente Qeswachaka sobre el río Apurímac", "Quehue, Canas — exploración guiada y fotos", "Regreso por la misma ruta", "En el camino: lagunas Pampamarca, Asnacqocha, Acopía y Pomacanchi", "Cusipata, almuerzo", "Cusco aproximadamente 17:00"]
    }
  },
  {
    id: "cusco-waqrapukara",
    esPlaceholder: false,
    publicado: true,
    tipo: "tour",
    nombre: "Waqrapukara Full Day",
    destino: "cusco",
    categoria: "Trekking",
    imagen: "assets/img/destino-peru-machupicchu.jpg",
    galeria: ["assets/img/destino-peru-machupicchu.jpg"],
    resumen: "Servicio compartido guiado en dos idiomas hasta la fortaleza inca de Waqrapukara, sobre el cañón del Apurímac.",
    descripcion: "Desayuno en Cusipata (alrededor de las 6:00) antes de tomar la ruta hacia Chukicahuana y Pomacanchis, pasando por QuelwaQocha (4350 m), Toccorani, el cañón del Apurímac y Santa Lucía. Desde ahí, una caminata de aproximadamente 3 horas —con flora y fauna en el camino— lleva hasta Waqrapukara, donde se recorren el Intipunku, la plaza principal, los torreones, la andenería, el recinto Wiracocha, Uña Waqrapukara y el Intihuatana. El regreso, de unas 2 horas y mayormente en descenso, termina con el almuerzo.",
    incluye: ["Guía", "Transporte", "Desayuno", "Almuerzo", "Botiquín", "Entrada S/10"],
    noIncluye: ["Propinas", "Snacks"],
    duracion: "Día completo",
    modalidad: "Servicio compartido",
    ubicacion: "Cusco, Perú",
    infoImportante: null,
    precio: null,
    destacada: false,
    detalle: {
      fecha: null,
      dificultad: null,
      distancia: null,
      desnivel: null,
      salida: "4:00–4:30",
      regreso: "18:30",
      puntoDeEncuentro: null,
      combinableConOtrosTours: false,
      seConvierteEnTravesiaAlCombinar: false,
      duracionCombinada: null,
      itinerarioCombinado: [],
      recorrido: ["Desayuno en Cusipata, aproximadamente 6:00", "Ruta vía Chukicahuana/Pomacanchis", "QuelwaQocha, 4350 m", "Toccorani", "Cañón del Apurímac", "Santa Lucía", "Caminata aproximadamente 3 h hasta Waqrapukara (flora y fauna)", "Intipunku, plaza principal, torreones, andenería, recinto Wiracocha, Uña Waqrapukara, Intihuatana", "Regreso caminando, aproximadamente 2 h (principalmente descenso)", "Almuerzo", "Cusco aproximadamente 18:30"]
    }
  },
  {
    id: "cusco-quelccaya",
    esPlaceholder: false,
    publicado: true,
    tipo: "tour",
    nombre: "Quelccaya – Suyuparina Full Day",
    destino: "cusco",
    categoria: "Trekking",
    imagen: "assets/img/vista-lago.jpg",
    imagenPos: "center 68%",
    galeria: ["assets/img/vista-lago.jpg"],
    resumen: "Recorrido hasta un mirador a 5200 m frente al glaciar Quelccaya y la laguna Sibinacocha.",
    descripcion: "Un traslado de aproximadamente 5 horas hasta Phinaya (4700 m) y una caminata de 45 minutos hasta los 5200 m llevan hasta un mirador con tiempo libre para fotografiar las lagunas cristalinas, las montañas de Vilcanota y el glaciar Quelccaya. El regreso pasa de nuevo por Phinaya para almorzar y por la laguna Sibinacocha, antes de volver a Cusco.",
    incluye: ["Guía", "Transporte", "Desayuno", "Almuerzo", "Botiquín", "Entrada S/15"],
    noIncluye: ["Propinas", "Snacks"],
    duracion: "Día completo",
    modalidad: "Servicio compartido",
    ubicacion: "Cusco, Perú",
    infoImportante: "Altitud 4700–5200 m, con frío. Se recomienda ropa abrigada, snacks, poncho de lluvia, anteojos de sol, protector solar y gorro.",
    precio: null,
    destacada: false,
    detalle: {
      fecha: null,
      dificultad: null,
      distancia: null,
      desnivel: null,
      salida: "3:00–3:30",
      regreso: "21:00",
      puntoDeEncuentro: "Plaza de Armas / hotel",
      combinableConOtrosTours: false,
      seConvierteEnTravesiaAlCombinar: false,
      duracionCombinada: null,
      itinerarioCombinado: [],
      recorrido: ["03:00 transferencia", "Aproximadamente 5 h hasta Phinaya, 4700 m", "08:30 desayuno", "10:00 caminata (aproximadamente 45 min hasta 5200 m)", "10:30 mirador — lagunas, montañas Vilcanota, glaciar Quelccaya", "Regreso aproximadamente 30 min", "13:30 almuerzo en Phinaya", "15:00 laguna Sibinacocha", "21:00 Cusco"]
    }
  },
  {
    id: "cusco-cuatrimotos-morada-dioses",
    esPlaceholder: false,
    publicado: true,
    tipo: "tour",
    nombre: "Tours en Cuatrimotos Morada de los Dioses",
    destino: "cusco",
    categoria: "Cuatrimotos",
    imagen: "assets/img/experiencias/pexels-kaushik21-26074194.jpg",
    galeria: ["assets/img/experiencias/pexels-kaushik21-26074194.jpg"],
    resumen: "Ruta en cuatrimoto con briefing de seguridad y práctica, hasta el mirador Morada de los Dioses.",
    descripcion: "Traslado privado hasta la base en Tica Tica, Sencca (unos 25 minutos), con un breve briefing de seguridad y una práctica antes de salir a la ruta en cuatrimoto: aproximadamente 45 minutos por trails y miradores hasta Morada de los Dioses, donde hay una visita guiada de media hora. El regreso a la base y la vuelta a Cusco son en vehículo privado.",
    incluye: ["Transporte privado hasta base", "Briefing/práctica", "Cuatrimotos Honda", "Ruta de aventura/trails/miradores", "Visita guiada a Morada de los Dioses", "Regreso en vehículo privado", "Protocolos COVID"],
    noIncluye: ["Entrada a Morada de los Dioses"],
    duracion: "Medio día",
    modalidad: "Salida grupal",
    ubicacion: "Cusco, Perú",
    infoImportante: null,
    precio: null,
    destacada: false,
    detalle: {
      fecha: null,
      dificultad: null,
      distancia: null,
      desnivel: null,
      salida: "08:00, 11:00, 13:00 o 15:00",
      regreso: null,
      puntoDeEncuentro: "Plaza de Armas / hoteles cercanos",
      combinableConOtrosTours: false,
      seConvierteEnTravesiaAlCombinar: false,
      duracionCombinada: null,
      itinerarioCombinado: [],
      recorrido: ["Base Tica Tica, Sencca (aproximadamente 25 min)", "5 min briefing de seguridad", "10 min práctica", "Ruta en cuatrimoto aproximadamente 45 min", "Visita Morada de los Dioses aproximadamente 30 min", "Regreso a base", "Regreso en vehículo a Calle Shapy, Cusco"]
    }
  },
  {
    id: "cusco-skybike-cachimayo",
    esPlaceholder: false,
    publicado: true,
    tipo: "tour",
    nombre: "Skybike, Rappel y Vía Ferrata Cachimayo",
    destino: "cusco",
    categoria: "Aventura",
    imagen: "assets/img/experiencias/pexels-viviane-couto-450464801-33463618.jpg",
    galeria: ["assets/img/experiencias/pexels-viviane-couto-450464801-33463618.jpg"],
    resumen: "Vía ferrata, skybike y rappel en Cachimayo, a unos 25 minutos de Cusco.",
    descripcion: "Un traslado de aproximadamente 25 minutos de Cusco a Cachimayo y una caminata de 10 minutos llevan hasta la vía ferrata, de 45 m de altura. La actividad combina el skybike —dos líneas, 250 m en total a 50 m de altura— con un rappel de 25 m, y cierra con un snack antes de volver a Cusco.",
    incluye: ["Equipo", "Arnés", "Casco", "Mosquetones", "Instructor", "Transporte privado", "Botiquín"],
    noIncluye: ["Almuerzo"],
    duracion: "Medio día",
    modalidad: "Salida grupal",
    ubicacion: "Cusco, Perú",
    infoImportante: "Protocolos de mascarilla. Se recomienda ropa liviana, calzado adecuado, protector solar, gorro y anteojos de sol.",
    precio: null,
    destacada: false,
    detalle: {
      fecha: null,
      dificultad: null,
      distancia: null,
      desnivel: null,
      salida: "8:15",
      regreso: "12:30",
      puntoDeEncuentro: null,
      combinableConOtrosTours: false,
      seConvierteEnTravesiaAlCombinar: false,
      duracionCombinada: null,
      itinerarioCombinado: [],
      recorrido: ["Cusco → Cachimayo, aproximadamente 25 min", "Caminata 10 min", "Vía ferrata, 45 m de altura", "Skybike: dos líneas, 250 m total / 50 m de altura", "Rappel: 25 m", "Snack", "Regreso aproximadamente 12:30"]
    }
  },

  /* ---------------- TOURS — USHUAIA / TIERRA DEL FUEGO ---------------- */
  {
    id: "ushuaia-canoas",
    esPlaceholder: false,
    publicado: true,
    tipo: "tour",
    nombre: "Canoas Experience",
    destino: "ushuaia",
    categoria: "Remo",
    imagen: "assets/img/experiencias/pexels-vinegarcias-18789208.jpg",
    galeria: ["assets/img/experiencias/pexels-vinegarcias-18789208.jpg"],
    resumen: "Remo en canoa por el Parque Nacional Tierra del Fuego: lago Acigami, río Lapataia y el Canal Beagle.",
    descripcion: "Una salida en canoa de dificultad baja por el Parque Nacional Tierra del Fuego: el lago Acigami, el río Lapataia, la Laguna Verde, el río Ovando, el Archipiélago Cormoranes, la Bahía Lapataia y el Canal Beagle, con 55 minutos de remo efectivo sobre 4,88 km en un recorrido total de 1:45 h. Incluye un snack en un domo (pastelería y café o infusiones, con opciones vegetariana, vegana y sin gluten). El orden y las atracciones pueden variar según el guía, el grupo y el clima.",
    incluye: ["Guías bilingües", "Traslado ida/retorno", "Snack", "Equipamiento de remo (chaleco salvavidas, sobrepantalón impermeable, botas)"],
    noIncluye: ["Entrada al parque"],
    duracion: "4 h",
    modalidad: "Salida grupal",
    ubicacion: "Ushuaia, Tierra del Fuego, Argentina",
    infoImportante: "Indicá restricciones o alergias alimentarias al reservar.",
    precio: null,
    destacada: false,
    detalle: {
      fecha: null,
      dificultad: "Baja",
      distancia: "4,88 km de remo",
      desnivel: null,
      salida: null,
      regreso: null,
      puntoDeEncuentro: null,
      combinableConOtrosTours: false,
      seConvierteEnTravesiaAlCombinar: false,
      duracionCombinada: null,
      itinerarioCombinado: [],
      recorrido: ["Lago Acigami", "Río Lapataia", "Laguna Verde", "Río Ovando", "Archipiélago Cormoranes", "Bahía Lapataia", "Canal Beagle"]
    }
  },
  {
    id: "ushuaia-trekking-canoas",
    esPlaceholder: false,
    publicado: true,
    tipo: "tour",
    nombre: "Trekking y Canoas",
    destino: "ushuaia",
    categoria: "Trekking & remo",
    imagen: "assets/img/experiencias/_MG_7745_Original.jpg",
    galeria: ["assets/img/experiencias/_MG_7745_Original.jpg"],
    resumen: "Combinación de trekking y canoas en el Parque Nacional Tierra del Fuego, con almuerzo de tres pasos.",
    descripcion: "Una jornada que combina tres senderos de dificultad baja —Cañadón del Toro hasta la cascada del río Pipo, Pampa Baja hasta el final de Pampa Alta, y el inicio de la senda Costera— con una salida en canoa. En el camino hay guanacos, el río Pipo y su cascada, el Bosque de las Agujas, lengas, castoreras, vestigios de arqueología Yamana y vistas a la Isla Redonda. El almuerzo, de tres pasos, incluye picada argentina, estofado de carne al malbec y brownies con café o infusiones (con opciones vegetariana, vegana y sin gluten). El orden y las atracciones pueden variar según el día.",
    incluye: ["Guías bilingües", "Traslado ida/retorno", "Almuerzo de tres pasos", "Equipamiento de remo"],
    noIncluye: ["Entrada al parque"],
    duracion: "8 h",
    modalidad: "Salida grupal",
    ubicacion: "Ushuaia, Tierra del Fuego, Argentina",
    infoImportante: "Indicá restricciones o alergias alimentarias al reservar.",
    precio: null,
    destacada: false,
    detalle: {
      fecha: null,
      dificultad: "Baja",
      distancia: null,
      desnivel: null,
      salida: null,
      regreso: null,
      puntoDeEncuentro: null,
      combinableConOtrosTours: false,
      seConvierteEnTravesiaAlCombinar: false,
      duracionCombinada: null,
      itinerarioCombinado: [],
      recorrido: ["Cañadón del Toro → cascada río Pipo (1:10 h, 3 km)", "Pampa Baja → final Pampa Alta (55 min, 1,13 km)", "Inicio senda Costera (1 h, 3,2 km)", "Salida en canoa", "Guanacos, Bosque de las Agujas, castoreras, arqueología Yamana, vista Isla Redonda"]
    }
  },
  {
    id: "ushuaia-sunset",
    esPlaceholder: false,
    publicado: true,
    tipo: "tour",
    nombre: "Ushuaia Sunset",
    destino: "ushuaia",
    categoria: "Trekking",
    imagen: "assets/img/experiencias/_MG_9700_Original.jpg",
    galeria: ["assets/img/experiencias/_MG_9700_Original.jpg"],
    resumen: "Caminata de atardecer por la Reserva Turística Camino del Glaciar Martial, con vistas nocturnas de Ushuaia y el Beagle.",
    descripcion: "Una caminata al atardecer por la Reserva Turística Camino del Glaciar Martial, atravesando bosque y turbales hasta tres miradores con vistas nocturnas de los Andes, Ushuaia, el canal Beagle y sus islas. La experiencia está disponible durante las cuatro estaciones del año.",
    incluye: ["Traslado ida/retorno", "Guía bilingüe", "Linterna frontal", "Bebida en La Cabaña Beer Point", "Snack de sendero: barras de cereal/frutos secos", "Agua/infusión caliente"],
    noIncluye: [],
    duracion: "3 h",
    modalidad: "Salida grupal",
    ubicacion: "Ushuaia, Tierra del Fuego, Argentina",
    infoImportante: null,
    precio: null,
    destacada: false,
    detalle: {
      fecha: null,
      dificultad: "Baja",
      distancia: "4,14 km",
      desnivel: "20 m",
      salida: null,
      regreso: null,
      puntoDeEncuentro: null,
      combinableConOtrosTours: false,
      seConvierteEnTravesiaAlCombinar: false,
      duracionCombinada: null,
      itinerarioCombinado: [],
      recorrido: ["Sendero desde Reserva Turística Camino del Glaciar Martial", "Bosque", "Turbales", "3 miradores", "Vistas nocturnas de Andes, Ushuaia, Beagle e islas"]
    }
  },
  {
    id: "ushuaia-estancia-tunel-trekking",
    esPlaceholder: false,
    publicado: true,
    tipo: "tour",
    nombre: "Estancia Túnel — Trekking",
    destino: "ushuaia",
    categoria: "Trekking",
    imagen: "assets/img/vista-lago.jpg",
    imagenPos: "center 68%",
    galeria: ["assets/img/vista-lago.jpg"],
    resumen: "Caminata por la costa del Beagle en la reserva natural y cultural de Playa Larga, hasta la antigua Estancia Túnel.",
    descripcion: "Una caminata por la costa del canal Beagle, dentro de la reserva natural y cultural de Playa Larga, hasta la antigua Estancia Túnel. En el camino hay historia del lugar, biodiversidad costera, un árbol bandera, notros y canelos, arbustos frutales y tramos de costa agreste.",
    incluye: ["Traslado ida/retorno", "Guía bilingüe", "Box lunch: sandwich + snack + agua/infusión caliente"],
    noIncluye: [],
    duracion: "3:30 h",
    modalidad: "Salida grupal",
    ubicacion: "Ushuaia, Tierra del Fuego, Argentina",
    infoImportante: null,
    precio: null,
    destacada: false,
    detalle: {
      fecha: null,
      dificultad: "Baja",
      distancia: "5 km",
      desnivel: null,
      salida: null,
      regreso: null,
      puntoDeEncuentro: null,
      combinableConOtrosTours: false,
      seConvierteEnTravesiaAlCombinar: false,
      duracionCombinada: null,
      itinerarioCombinado: [],
      recorrido: ["Costa del Beagle", "Sendero hacia la antigua Estancia Túnel", "Historia del lugar", "Biodiversidad costera", "Árbol bandera, notros y canelos", "Arbustos frutales", "Costas agrestes"]
    }
  },
  {
    id: "ushuaia-balcones-susana",
    esPlaceholder: false,
    publicado: true,
    tipo: "tour",
    nombre: "Balcones del Susana",
    destino: "ushuaia",
    categoria: "Trekking",
    imagen: "assets/img/fauna-montana.jpg",
    galeria: ["assets/img/fauna-montana.jpg"],
    resumen: "Ascenso al Monte Susana (aproximadamente 500 m) con vistas al Parque Nacional Tierra del Fuego.",
    descripcion: "Un ascenso hasta la cumbre del Monte Susana, una geoforma de origen glacial, con vistas al Parque Nacional Tierra del Fuego, el Cerro Guanaco, la Isla Navarino, la Isla Hoste, la Bahía Ushuaia y la Cordillera Darwin.",
    incluye: ["Traslado ida/retorno", "Guía bilingüe", "Box lunch: sandwich + snack + agua/infusión caliente"],
    noIncluye: [],
    duracion: "5 h",
    modalidad: "Salida grupal",
    ubicacion: "Ushuaia, Tierra del Fuego, Argentina",
    infoImportante: null,
    precio: null,
    destacada: false,
    detalle: {
      fecha: null,
      dificultad: "Moderada",
      distancia: "5,5 km",
      desnivel: "400 m",
      salida: null,
      regreso: null,
      puntoDeEncuentro: null,
      combinableConOtrosTours: false,
      seConvierteEnTravesiaAlCombinar: false,
      duracionCombinada: null,
      itinerarioCombinado: [],
      recorrido: ["Ascenso al Monte Susana, aproximadamente 500 m", "Cumbre: geoforma glacial", "Vistas al Parque Nacional Tierra del Fuego, Cerro Guanaco, Isla Navarino, Isla Hoste, Bahía Ushuaia y Cordillera Darwin"]
    }
  },
  {
    id: "ushuaia-lagunas-gemelas",
    esPlaceholder: false,
    publicado: true,
    tipo: "tour",
    nombre: "Lagunas Gemelas",
    destino: "ushuaia",
    categoria: "Trekking",
    imagen: "assets/img/patagonia.jpg",
    galeria: ["assets/img/patagonia.jpg"],
    resumen: "Caminata al nordeste de la isla, junto al Paso Garibaldi, hasta dos reservorios formados por castores.",
    descripcion: "Una caminata al nordeste de la isla, sobre la Ruta 3 antes del Paso Garibaldi, por un bosque de altura hasta dos reservorios formados por castores. El recorrido incluye el mirador del Paso Garibaldi y vistas al Lago Escondido y al Lago Khami.",
    incluye: ["Traslado ida/retorno", "Guía bilingüe", "Box lunch: sandwich + snack + agua/infusión caliente"],
    noIncluye: [],
    duracion: "5 h",
    modalidad: "Salida grupal",
    ubicacion: "Ushuaia, Tierra del Fuego, Argentina",
    infoImportante: null,
    precio: null,
    destacada: false,
    detalle: {
      fecha: null,
      dificultad: "Moderada",
      distancia: "2,5 km",
      desnivel: "283 m",
      salida: null,
      regreso: null,
      puntoDeEncuentro: null,
      combinableConOtrosTours: false,
      seConvierteEnTravesiaAlCombinar: false,
      duracionCombinada: null,
      itinerarioCombinado: [],
      recorrido: ["Bosque de altura", "Dos reservorios creados por castores", "Mirador Paso Garibaldi", "Lago Escondido", "Lago Khami"]
    }
  },
  {
    id: "ushuaia-lagunas-gemelas-full-day",
    esPlaceholder: false,
    publicado: true,
    tipo: "tour",
    nombre: "Lagunas Gemelas Full Day",
    destino: "ushuaia",
    categoria: "Trekking",
    imagen: "assets/img/patagonia.jpg",
    galeria: ["assets/img/patagonia.jpg"],
    resumen: "Versión extendida de Lagunas Gemelas: cumbre del Cerro Verde, Laguna Raquel y Laguna de los Perros.",
    descripcion: "La versión extendida de Lagunas Gemelas: continúa hasta la cumbre del Cerro Verde y sigue por la cresta hasta la Laguna Raquel, a 600 m sobre la vegetación y con vistas al Cerro Negro, antes de descender por el valle hasta la Laguna de los Perros. Todo el recorrido ofrece panorámicas de lagos, montañas y lagunas.",
    incluye: ["Traslado ida/retorno", "Guía bilingüe", "Box lunch: sandwich + snack", "Agua/infusión caliente"],
    noIncluye: [],
    duracion: "7 h",
    modalidad: "Salida grupal",
    ubicacion: "Ushuaia, Tierra del Fuego, Argentina",
    infoImportante: null,
    precio: null,
    destacada: false,
    detalle: {
      fecha: null,
      dificultad: "Alta",
      distancia: "9 km",
      desnivel: "450 m",
      salida: null,
      regreso: null,
      puntoDeEncuentro: null,
      combinableConOtrosTours: false,
      seConvierteEnTravesiaAlCombinar: false,
      duracionCombinada: null,
      itinerarioCombinado: [],
      recorrido: ["Más allá de Lagunas Gemelas", "Cumbre Cerro Verde", "Cresta hacia Laguna Raquel (600 m sobre la vegetación, vistas al Cerro Negro)", "Descenso por el valle", "Laguna de los Perros", "Panorámicas de lagos, montañas y lagunas"]
    }
  },
  {
    id: "ushuaia-trek-andino",
    esPlaceholder: false,
    publicado: true,
    tipo: "tour",
    nombre: "Trek Andino",
    destino: "ushuaia",
    categoria: "Trekking",
    imagen: "assets/img/experiencias/pexels-anastasiakasina-36865249.JPG",
    galeria: ["assets/img/experiencias/pexels-anastasiakasina-36865249.JPG"],
    resumen: "Trekking de alta exigencia por la Sierra Sorondo / valle Olum, entre lagunas turquesas y la Laguna Esmeralda.",
    descripcion: "Un trekking de alta exigencia por la Sierra Sorondo, sobre el valle Olum, que pasa por la Laguna Turquesa y la Laguna Ausente, con vistas a la Sierra Alvear, hasta llegar a la Laguna Esmeralda.",
    incluye: ["Traslado ida/retorno", "Guía bilingüe", "Box lunch: sandwich + snack", "Agua/infusión caliente"],
    noIncluye: [],
    duracion: "7 h",
    modalidad: "Salida grupal",
    ubicacion: "Ushuaia, Tierra del Fuego, Argentina",
    infoImportante: null,
    precio: null,
    destacada: true,
    detalle: {
      fecha: null,
      dificultad: "Alta",
      distancia: "12 km",
      desnivel: "450 m",
      salida: null,
      regreso: null,
      puntoDeEncuentro: null,
      combinableConOtrosTours: false,
      seConvierteEnTravesiaAlCombinar: false,
      duracionCombinada: null,
      itinerarioCombinado: [],
      recorrido: ["Sierra Sorondo / valle Olum", "Laguna Turquesa", "Laguna Ausente", "Vistas Sierra Alvear", "Laguna Esmeralda"]
    }
  },
  {
    id: "ushuaia-urban-landscape",
    esPlaceholder: false,
    publicado: true,
    tipo: "tour",
    nombre: "Urban Landscape",
    destino: "ushuaia",
    categoria: "E-bike",
    imagen: "assets/img/experiencias/Urban E-bike 2_Original.jpg",
    galeria: ["assets/img/experiencias/Urban E-bike 2_Original.jpg"],
    resumen: "Recorrido en e-bike por sectores emblemáticos de Ushuaia y observación de aves en la Reserva Natural Bahía Encerrada.",
    descripcion: "Un recorrido en e-bike de 15 km que combina paisaje urbano y natural: sectores emblemáticos de Ushuaia, miradores y observación de aves en la Reserva Natural Bahía Encerrada.",
    incluye: ["Agua", "Barra de cereal", "Infusión caliente durante el recorrido", "Parada de snack en Laguna Café de Barrio: bebida + pastelería"],
    noIncluye: [],
    duracion: "3 h",
    modalidad: "Salida grupal",
    ubicacion: "Ushuaia, Tierra del Fuego, Argentina",
    infoImportante: "Incluye bicicleta con asistencia eléctrica, casco, anorak GoreTex, sobrepantalón impermeable y guantes de ciclismo.",
    precio: null,
    destacada: false,
    detalle: {
      fecha: null,
      dificultad: "Baja",
      distancia: "15 km",
      desnivel: "160 m",
      salida: null,
      regreso: null,
      puntoDeEncuentro: null,
      combinableConOtrosTours: false,
      seConvierteEnTravesiaAlCombinar: false,
      duracionCombinada: null,
      itinerarioCombinado: [],
      recorrido: ["Sectores emblemáticos de la ciudad", "Miradores", "Observación de aves en Reserva Natural Bahía Encerrada"]
    }
  },
  {
    id: "ushuaia-mirador-beagle",
    esPlaceholder: false,
    publicado: true,
    tipo: "tour",
    nombre: "Mirador del Beagle",
    destino: "ushuaia",
    categoria: "E-bike",
    imagen: "assets/img/experiencias/MiradorBeagle1_Original.jpg",
    galeria: ["assets/img/experiencias/MiradorBeagle1_Original.jpg"],
    resumen: "Recorrido en e-bike por una ruta alternativa hacia el Martial, con vistas al Canal Onashaga y al glaciar.",
    descripcion: "Una ruta alternativa en e-bike de 25 km, por bosques y turbales hacia el cerro Martial, con vistas al Canal Onashaga y sus islas hacia el sur, y al glaciar y las montañas hacia el norte.",
    incluye: ["Agua", "Barra de cereal", "Infusión caliente", "Parada de snack en Laguna Café de Barrio: bebida + pastelería"],
    noIncluye: [],
    duracion: "4 h",
    modalidad: "Salida grupal",
    ubicacion: "Ushuaia, Tierra del Fuego, Argentina",
    infoImportante: "Incluye bicicleta con asistencia eléctrica, casco, anorak GoreTex, sobrepantalón impermeable y guantes de ciclismo.",
    precio: null,
    destacada: false,
    detalle: {
      fecha: null,
      dificultad: "Media",
      distancia: "25 km",
      desnivel: "350 m",
      salida: null,
      regreso: null,
      puntoDeEncuentro: null,
      combinableConOtrosTours: false,
      seConvierteEnTravesiaAlCombinar: false,
      duracionCombinada: null,
      itinerarioCombinado: [],
      recorrido: ["Ruta alternativa por bosques y turbales hacia Martial", "Vistas del Canal Onashaga/islas al sur", "Glaciar y montañas al norte"]
    }
  },
  {
    id: "ushuaia-estancia-tunel-ebike",
    esPlaceholder: false,
    publicado: true,
    tipo: "tour",
    nombre: "Estancia Túnel — E-bike",
    destino: "ushuaia",
    categoria: "E-bike",
    imagen: "assets/img/experiencias/Ea Tunel E-bike 5_Original.jpg",
    galeria: ["assets/img/experiencias/Ea Tunel E-bike 5_Original.jpg"],
    resumen: "La misma ruta de Estancia Túnel, recorrida en e-bike, con transfer desde el centro de la ciudad.",
    descripcion: "La misma ruta de Estancia Túnel, recorrida en e-bike a lo largo de 11,2 km.",
    incluye: ["Transfer ida/retorno desde ubicación comercial Deloqui 756", "Snack de sendero", "Sandwich", "Agua/bebida caliente"],
    noIncluye: [],
    duracion: "5 h",
    modalidad: "Salida grupal",
    ubicacion: "Ushuaia, Tierra del Fuego, Argentina",
    infoImportante: "Incluye bicicleta con asistencia eléctrica, casco, anorak GoreTex, sobrepantalón impermeable y guantes de ciclismo.",
    precio: null,
    destacada: false,
    detalle: {
      fecha: null,
      dificultad: "Moderada/alta",
      distancia: "11,2 km",
      desnivel: "260 m",
      salida: null,
      regreso: null,
      puntoDeEncuentro: "Deloqui 756",
      combinableConOtrosTours: false,
      seConvierteEnTravesiaAlCombinar: false,
      duracionCombinada: null,
      itinerarioCombinado: [],
      recorrido: ["Misma ruta base de Estancia Túnel (ver versión trekking)"]
    }
  },
  {
    id: "ushuaia-cascada-beban",
    esPlaceholder: false,
    publicado: true,
    tipo: "tour",
    nombre: "Cascada Beban",
    destino: "ushuaia",
    categoria: "E-bike",
    imagen: "assets/img/experiencias/Beban E-bike  5_Original.jpg",
    galeria: ["assets/img/experiencias/Beban E-bike  5_Original.jpg", "assets/img/experiencias/Beban E-bike 4_Original.jpg"],
    resumen: "E-bike por el histórico sendero de Hacheros en el Valle de Tierra Mayor, hasta la Cascada Beban.",
    descripcion: "Un e-bike de 12,7 km por el antiguo sendero de Hacheros, en el Valle de Tierra Mayor: una traza histórica de extracción de leña de la década de 1940 que atraviesa el Valle Carbajal, la Sierra Sorondo y el Cerro Bonete hasta la Cascada Beban, con vista al glaciar.",
    incluye: ["Transfer ida/retorno desde Deloqui 756", "Snack de sendero", "Sandwich", "Agua/bebida caliente"],
    noIncluye: [],
    duracion: "6 h",
    modalidad: "Salida grupal",
    ubicacion: "Ushuaia, Tierra del Fuego, Argentina",
    infoImportante: "Incluye bicicleta con asistencia eléctrica, casco, anorak GoreTex, sobrepantalón impermeable y guantes de ciclismo.",
    precio: null,
    destacada: false,
    detalle: {
      fecha: null,
      dificultad: "Moderada/alta",
      distancia: "12,7 km",
      desnivel: "200 m",
      salida: null,
      regreso: null,
      puntoDeEncuentro: "Deloqui 756",
      combinableConOtrosTours: false,
      seConvierteEnTravesiaAlCombinar: false,
      duracionCombinada: null,
      itinerarioCombinado: [],
      recorrido: ["Traslado hasta el antiguo sendero de Hacheros, Valle de Tierra Mayor", "Sendero histórico de extracción de leña (década de 1940)", "Valle Carbajal", "Sierra Sorondo", "Cerro Bonete", "Cascada Beban", "Vista al glaciar"]
    }
  },

  /* ---------------- TRAVESÍAS — PERÚ ---------------- */
  {
    id: "peru-salkantay-trek",
    esPlaceholder: false,
    publicado: true,
    tipo: "travesia",
    nombre: "Salkantay Trek",
    destino: "cusco",
    categoria: "Trekking",
    imagen: "assets/img/experiencias/pexels-davidexpedition-30228477.jpg",
    imagenPos: "center 68%",
    galeria: ["assets/img/experiencias/pexels-davidexpedition-30228477.jpg"],
    resumen: "Trekking de 5 días junto al nevado Salkantay, desde Cusco hasta Machupicchu, cruzando valles, selva alta y pueblos andinos.",
    descripcion: "Cinco días de caminata desde Mollepata hasta Machupicchu bordeando el nevado Salkantay: alta montaña el primer tramo, valles y ceja de selva después, con cascadas, orquídeas y vistas sobre el Urubamba en el camino. Se avanza en campamento y en alojamientos locales hasta Aguas Calientes, desde donde se sube a visitar la ciudadela con guía antes de regresar a Cusco en tren.",
    incluye: ["Transporte Cusco–Mollepata", "Guía profesional", "4 desayunos, 4 almuerzos y 4 cenas", "Caballos para equipo, alimentos y hasta 5 kg de equipaje por pasajero", "Equipo de camping", "Entrada a Machupicchu", "Transporte Hidroeléctrica–Cusco (si el regreso es por Hidroeléctrica)"],
    noIncluye: ["Tren de regreso a Cusco (según horario elegido)", "Propinas", "Gastos personales"],
    duracion: "5 días / 4 noches",
    modalidad: "Servicio compartido",
    ubicacion: "Cusco, Perú",
    infoImportante: "La entrada a Machupicchu está incluida; los detalles finales del ingreso se confirman antes de la salida.",
    precio: null,
    destacada: true,

    detalle: {
      dificultad: null,
      distanciaTotal: null,
      fechas: [],
      itinerario: [
        { dia: 1, titulo: "Cusco → Soraypampa", descripcion: "Recojo en el hostel entre 04:15 y 04:30, salida 05:00 y traslado por Izcuchaca, Limatambo y Mollepata, con desayuno en el camino. Caminata hacia Cruz Pata y continuación hasta Soraypampa, donde se arma el campamento." },
        { dia: 2, titulo: "Soraypampa → Chaullay", descripcion: "Caminata atravesando el valle de Collpabamba, con almuerzo durante el recorrido, hasta ingresar en la ceja de selva: ríos y afluentes del Urubamba, orquídeas, una cascada y vistas del Salkantay. Noche en Chaullay." },
        { dia: 3, titulo: "Chaullay → Playa Sahuayaco → Santa Teresa", descripcion: "Caminata entre zonas de cultivo de coca, con descenso hasta Playa Sahuayaco y continuación hasta Santa Teresa, donde se pernocta." },
        { dia: 4, titulo: "Santa Teresa → Aguas Calientes", descripcion: "Recorrido por zona tropical, con caminata de aproximadamente 7 horas hasta Aguas Calientes pasando por Hidroeléctrica (existe la opción de tomar el tren desde ahí). En el trayecto se observan cascadas provenientes de los glaciares. Noche en hostel en Aguas Calientes." },
        { dia: 5, titulo: "Machupicchu → Cusco", descripcion: "Ascenso a Machupicchu alrededor de las 04:30 y visita guiada de aproximadamente 2 horas, con tiempo libre después (opción de subir a Inti Punku o recorrer Aguas Calientes). Regreso a Cusco en tren, según el horario asignado (14:55, 15:20, 16:43, 18:20 o 21:50)." }
      ],
      alojamiento: "Camping + hostel",
      comidas: "4 desayunos, 4 almuerzos y 4 cenas",
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
  {
    id: "peru-choquequirao-trek",
    esPlaceholder: false,
    publicado: true,
    tipo: "travesia",
    nombre: "Choquequirao Trekking",
    destino: "choquequirao",
    categoria: "Trekking",
    imagen: "assets/img/experiencias/pexels-teresita-ramirez-583628649-17043331.jpg",
    galeria: ["assets/img/experiencias/pexels-teresita-ramirez-583628649-17043331.jpg"],
    resumen: "Trekking exigente de 4 días hasta Choquequirao, la ciudad inca hermana de Machupicchu, cruzando el Cañón del Apurímac.",
    descripcion: "Ruta exigente por los Andes hasta Choquequirao a través del Cañón del Apurímac, con pasos de montaña, bosques nublados y valles verdes. En el camino hay posibilidad de observar flora y fauna andina —cóndores, zorros andinos, venados y oso de anteojos— antes de llegar a las terrazas, plazas y restos arqueológicos incas del sitio, aún en gran parte sin excavar. Las noches son en alojamiento rural y en cabañas, con habitaciones dobles/twin, duchas frías y baños compartidos.",
    incluye: ["Guía profesional bilingüe", "Transporte turístico Cusco–Capuliyoc–Cusco", "3 noches de alojamiento", "3 desayunos, 4 almuerzos y 3 cenas", "Opciones vegetarianas", "Entrada a Choquequirao"],
    noIncluye: ["Primer desayuno", "Snacks", "Agua embotellada", "Caballo (S/ 80 por persona)", "Bastones de trekking"],
    duracion: "4 días / 3 noches",
    modalidad: "Salida con reserva previa",
    ubicacion: "Cusco, Perú",
    infoImportante: "Salidas disponibles cualquier fecha, con reserva previa. El caballo y el arriero no están incluidos.",
    precio: null,
    destacada: false,

    detalle: {
      dificultad: null,
      distanciaTotal: null,
      fechas: [],
      itinerario: [
        { dia: 1, titulo: "Cusco → Capuliyoc → Chikiska", descripcion: "Recojo en el hotel o en Plazoleta Regocijo antes de las 06:00–06:30 y traslado de aproximadamente 4 horas hasta San Pedro de Cachora / Capuliyoc. Almuerzo con vistas al Cañón del Apurímac y Padreyoc, y descenso de 3 a 4 horas por Cocamasana hasta Chikiska (2950 m máx. / 2100 m mín., 8 km, 3–4 h de caminata), con cena y alojamiento rural." },
        { dia: 2, titulo: "Chikiska → río Apurímac → Santa Rosa → Marampata", descripcion: "Descenso de aproximadamente 1 hora hasta Playa Rosalina y cruce del río Apurímac, seguido de un ascenso de 2 horas hasta Santa Rosa y otras 2 horas hasta Marampata, con desnivel acumulado de aproximadamente 1500 m (2970 m, 9 km, 4–5 h). Tarde libre para conocer Marampata, su agricultura y la vida quechua local. Cena y alojamiento en cabañas." },
        { dia: 3, titulo: "Marampata → Choquequirao → Santa Rosa o Chikiska", descripcion: "Desayuno antes del amanecer y caminata de aproximadamente 1,5 h (4,5 km) hasta el sitio arqueológico: las terrazas de las Llamas, la plaza central (3068 m) y el sector Hanan (3136 m), con restos aún sin excavar y vistas panorámicas. Almuerzo en el campamento y regreso por sendero rocoso hacia Marampata y Santa Rosa (3140 m máx. / 2200 m mín., 9 km, 5 h). Cena y alojamiento en cabañas dobles." },
        { dia: 4, titulo: "Santa Rosa → Capuliyoc → Cusco", descripcion: "Descenso por terreno rocoso hasta el Apurímac y ascenso por Chiquisca y Cocamasana hasta Capuliyoc (2950 m máx. / 1530 m mín., 7 km, 5–6 h), con almuerzo y descanso. Transporte de aproximadamente 4,5 horas de regreso a Cusco." }
      ],
      alojamiento: "Rural + cabañas",
      comidas: "3 desayunos, 4 almuerzos y 3 cenas (no incluye el primer desayuno)",
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
  {
    id: "peru-machupicchu-carro",
    esPlaceholder: false,
    publicado: true,
    tipo: "travesia",
    nombre: "Machupicchu en Carro",
    destino: "cusco",
    categoria: "Machu Picchu",
    imagen: "assets/img/galeria-machupicchu-terrazas.jpg",
    galeria: ["assets/img/galeria-machupicchu-terrazas.jpg", "assets/img/experiencias/pexels-underxpossed-38263090.jpg"],
    resumen: "Alternativa terrestre de 2 días a Machupicchu: Valle Sagrado, Abra Málaga, Hidroeléctrica y caminata final hasta Aguas Calientes.",
    descripcion: "Una forma más económica de llegar a Machupicchu por tierra, cruzando el Valle Sagrado y el Abra Málaga (4316 m) antes de bajar hacia la selva hasta Santa Teresa e Hidroeléctrica. Desde ahí, una caminata de aproximadamente 2,5 horas lleva hasta Aguas Calientes, donde se pernocta antes de la visita guiada a la ciudadela al día siguiente.",
    incluye: ["Transporte turístico ida y vuelta Cusco–Hidroeléctrica–Cusco", "1 noche de hotel", "1 almuerzo y 1 cena el día 1", "1 desayuno el día 2", "Entrada a Machupicchu", "Guía profesional en inglés y español"],
    noIncluye: ["Tren Hidroeléctrica–Aguas Calientes ida y vuelta (USD 40 por tramo)", "Bus Aguas Calientes–Machupicchu (USD 27)", "Otros gastos no indicados"],
    duracion: "2 días / 1 noche",
    modalidad: "Servicio compartido",
    ubicacion: "Cusco, Perú",
    infoImportante: null,
    precio: null,
    destacada: false,

    detalle: {
      dificultad: null,
      distanciaTotal: null,
      fechas: [],
      itinerario: [
        { dia: 1, titulo: "Cusco → Santa Teresa → Hidroeléctrica → Aguas Calientes", descripcion: "Recojo a las 06:00 y recorrido por el Valle Sagrado hasta el Abra Málaga (4316 m), con descenso hacia la zona de selva y Santa María. Llegada a Santa Teresa alrededor de las 14:00 para almorzar, y a Hidroeléctrica cerca de las 15:30. Caminata de aproximadamente 2,5 horas hasta Aguas Calientes, con cena y briefing del guía, y entrega de entradas a Machupicchu." },
        { dia: 2, titulo: "Aguas Calientes → Machupicchu → Cusco", descripcion: "Subida a Machupicchu en bus o caminando, con visita guiada de aproximadamente 3 horas y regreso a Aguas Calientes con tiempo libre. Transporte desde Hidroeléctrica a las 14:00 (presentarse 30 minutos antes) y retorno por Santa Teresa hasta Cusco, con llegada aproximada a las 21:30." }
      ],
      alojamiento: "1 noche de hostel en Aguas Calientes",
      comidas: "1 almuerzo y 1 cena el día 1, 1 desayuno el día 2",
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
  {
    id: "peru-machupicchu-tren",
    esPlaceholder: false,
    publicado: true,
    tipo: "travesia",
    nombre: "Machupicchu",
    destino: "cusco",
    categoria: "Machu Picchu",
    imagen: "assets/img/destino-peru-machupicchu.jpg",
    galeria: ["assets/img/destino-peru-machupicchu.jpg", "assets/img/experiencias/pexels-sergei-a-1322276-2539417.jpg"],
    resumen: "2 días a Machupicchu en tren, con visita guiada privada del Circuito 2 y una noche de hotel en Aguas Calientes.",
    descripcion: "La forma más cómoda de conocer Machupicchu: traslado a Ollantaytambo y tren hasta Aguas Calientes, donde se pernocta antes de subir a la ciudadela para una visita guiada privada por el Circuito 2. El regreso combina bus, tren y traslado privado hasta Cusco.",
    incluye: ["Traslado Cusco–Ollantaytambo", "Ticket de tren de ida (12:55, servicio Expedition)", "1 noche de hotel", "Buses Aguas Calientes–Machupicchu ida y vuelta", "Guiado privado del Circuito 2", "Ticket de tren de retorno", "Transporte privado Ollantaytambo–Cusco"],
    noIncluye: ["Alimentación (desayuno, almuerzo y cena)", "Gastos adicionales"],
    duracion: "2 días / 1 noche",
    modalidad: "Servicio privado",
    ubicacion: "Cusco, Perú",
    infoImportante: "Opciones de tren de retorno sujetas a disponibilidad: Vistadome Observatory (15:20 o 16:22), Expedition (14:55) o Vistadome (15:48).",
    precio: null,
    destacada: false,

    detalle: {
      dificultad: null,
      distanciaTotal: null,
      fechas: [],
      itinerario: [
        { dia: 1, titulo: "Cusco → Ollantaytambo → Aguas Calientes", descripcion: "Recojo del hotel a las 09:30 y traslado a Ollantaytambo (aproximadamente 2 h). Tren de las 12:55 (servicio Expedition) hasta Aguas Calientes, con llegada cerca de las 14:50: personal del hotel recibe a los pasajeros y se realiza el check-in." },
        { dia: 2, titulo: "Machupicchu → Ollantaytambo → Cusco", descripcion: "Desayuno en el hotel y traslado a la estación de buses hacia Machupicchu, con visita guiada privada del Circuito 2. Regreso en bus a Aguas Calientes con tiempo libre para almorzar, tren de vuelta a Ollantaytambo y traslado privado hasta Cusco." }
      ],
      alojamiento: "1 noche de hotel en Aguas Calientes",
      comidas: null,
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

  /* ---------------- TRAVESÍAS — PATAGONIA ---------------- */
  {
    id: "patagonia-bariloche-magico",
    esPlaceholder: false,
    publicado: true,
    tipo: "travesia",
    nombre: "Bariloche Mágico — Del Bosque a la Estepa",
    destino: "bariloche",
    categoria: "Ciclismo",
    imagen: "assets/img/experiencias/Valle del Manso.jpeg",
    galeria: ["assets/img/experiencias/Valle del Manso.jpeg"],
    resumen: "4 días de ciclismo por Bariloche, alternando estepa patagónica, bosque, valles y lagos hasta Colonia Suiza.",
    descripcion: "Una travesía de ciclismo por distintos paisajes de Bariloche y sus alrededores: estepa junto a las vías del tren, el sector sur del Parque Nacional en el Valle del Manso, la estepa patagónica del Valle del Ñirihuau y, para cerrar, bosques y lagos hasta Colonia Suiza. En total, unos 130 km repartidos entre gravel, senderos y asfalto.",
    incluye: ["Bicicletas", "Traslados", "Guías", "Seguro", "Vehículo de apoyo", "Estaciones de hidratación", "Almuerzos"],
    noIncluye: ["Alojamiento", "Cenas", "Bebidas alcohólicas", "Propinas"],
    duracion: "4 días / 3 noches",
    modalidad: "Salida grupal",
    ubicacion: "Bariloche, Río Negro, Argentina",
    infoImportante: null,
    precio: null,
    destacada: false,

    detalle: {
      dificultad: "Media",
      distanciaTotal: "130 km · 70% gravel · 20% senderos · 10% asfalto",
      fechas: ["14 – 17 ene 2027"],
      itinerario: [
        { dia: 1, titulo: "Estepa", descripcion: "35 km junto a las vías del tren hasta la estación Perito Moreno, con regreso y transferencia de aproximadamente 1 hora." },
        { dia: 2, titulo: "Valle del Manso", descripcion: "20 km por el sector sur del Parque Nacional, entre ríos y bosque. Transferencia total aproximada de 3 horas." },
        { dia: 3, titulo: "Valle del Ñirihuau", descripcion: "34 km atravesando paisaje de estepa patagónica, con transferencia aproximada de 1 hora." },
        { dia: 4, titulo: "Lago Gutiérrez → Colonia Suiza", descripcion: "39 km entre bosques y lagos hasta llegar a Colonia Suiza." }
      ],
      alojamiento: "No incluido",
      comidas: "Almuerzos incluidos (no incluye cenas)",
      personalizable: true,
      logisticaNoIncluida: [
        "Vuelo hasta el destino",
        "Traslado aeropuerto → hotel",
        "Traslado hotel → punto de encuentro",
        "Alojamiento previo, durante o posterior a la travesía",
        "Traslado de regreso al aeropuerto"
      ]
    }
  },
  {
    id: "patagonia-7-lagos-ebike",
    esPlaceholder: false,
    publicado: true,
    tipo: "travesia",
    nombre: "La Ruta de los 7 Lagos con E-bikes",
    destino: "bariloche",
    categoria: "E-bike",
    imagen: "assets/img/experiencias/circuito chico - .jpeg",
    galeria: ["assets/img/experiencias/circuito chico - .jpeg"],
    resumen: "4 días en e-bike de Bariloche a San Martín de los Andes por la Ruta de los 7 Lagos, con catamarán a Arrayanes y noche en carpa.",
    descripcion: "La clásica Ruta de los 7 Lagos en e-bike, de Bariloche a San Martín de los Andes: cruce en catamarán hacia Arrayanes, sendero de bosque, Villa La Angostura y los lagos Espejo, Correntoso, Escondido, Villarino, Falkner, Hermoso y Machónico en el camino, hasta el descenso final sobre el lago Lácar. Unos 135 km en total, mayormente asfaltados.",
    incluye: ["Bicicletas", "Guías", "Seguro", "Snacks", "Vehículo de apoyo", "Catamarán", "3 noches de alojamiento entre hostería, carpas y dormis", "Cena el día 1", "Todas las comidas los días 2 y 3", "Desayuno y almuerzo el día 4", "Transportes necesarios", "Traslado de equipaje"],
    noIncluye: ["Entradas a parques", "Alcohol", "Propinas", "Regreso San Martín de los Andes–Bariloche (puede coordinarse aparte)"],
    duracion: "4 días / 3 noches",
    modalidad: "Salida grupal",
    ubicacion: "Bariloche → San Martín de los Andes, Argentina",
    infoImportante: null,
    precio: null,
    destacada: false,

    detalle: {
      dificultad: "Baja +",
      distanciaTotal: "135 km · 15% gravel · 85% asfalto",
      fechas: ["10 – 13 dic 2026", "18 – 21 feb 2027", "18 – 21 mar 2027"],
      itinerario: [
        { dia: 1, titulo: "Bariloche", descripcion: "Encuentro por la tarde en el alojamiento, presentación con los guías, prueba de bicicletas y cena de bienvenida." },
        { dia: 2, titulo: "Bariloche → Hostería 7 Lagos / Lago Correntoso", descripcion: "42 km en e-bike combinados con un cruce en catamarán hacia Arrayanes y 12 km por sendero de bosque, pasando por Villa La Angostura y el lago Espejo hasta Correntoso. Noche en carpa (carpa y aislante incluidos)." },
        { dia: 3, titulo: "Correntoso → Lago Hermoso", descripcion: "49 km pasando por los lagos Escondido, Villarino y Falkner, con almuerzo en el camino. Noche en Lago Hermoso." },
        { dia: 4, titulo: "Lago Hermoso → San Martín de los Andes", descripcion: "37 km junto al lago Machónico y descenso final de 15 km hacia el lago Lácar, con almuerzo y fin de servicios alrededor de las 16:00." }
      ],
      alojamiento: "3 noches entre hostería, carpa y dormis",
      comidas: "Cena el día 1, todas las comidas los días 2 y 3, desayuno y almuerzo el día 4",
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
  {
    id: "patagonia-7-lagos-premium-ebike",
    esPlaceholder: false,
    publicado: true,
    tipo: "travesia",
    nombre: "7 Lagos Premium con E-bikes",
    destino: "bariloche",
    categoria: "E-bike",
    imagen: "assets/img/experiencias/San Carlos de Bariloche desde Brazo Huemul.jpg",
    galeria: ["assets/img/experiencias/San Carlos de Bariloche desde Brazo Huemul.jpg"],
    resumen: "Versión premium de 5 días de la Ruta de los 7 Lagos, con Circuito Chico, Villa Traful y hotel 4 estrellas cada noche.",
    descripcion: "La versión más completa de la Ruta de los 7 Lagos en e-bike: el Circuito Chico y un cruce en catamarán a Arrayanes, Villa La Angostura, Villa Traful y los lagos Espejo, Correntoso, Villarino, Falkner y Hermoso, hasta el descenso final a San Martín de los Andes. Cinco días en e-bike, unos 207 km en total, con hotel 4 estrellas cada noche.",
    incluye: ["E-bikes", "Guías", "Seguro", "Snacks", "Vehículo de apoyo", "Catamarán", "4 noches de hotel 4 estrellas", "Cena el día 1", "Todas las comidas los días 2, 3 y 4", "Desayuno y almuerzo el día 5", "Transportes necesarios", "Traslado de equipaje"],
    noIncluye: ["Entradas a parques", "Alcohol", "Propinas", "Regreso San Martín de los Andes–Bariloche (puede coordinarse aparte)"],
    duracion: "5 días / 4 noches",
    modalidad: "Salida grupal",
    ubicacion: "Bariloche → San Martín de los Andes, Argentina",
    infoImportante: null,
    precio: null,
    destacada: false,

    detalle: {
      dificultad: "Baja +",
      distanciaTotal: "207 km · 20% gravel · 80% asfalto",
      fechas: ["10 – 14 mar 2027"],
      itinerario: [
        { dia: 1, titulo: "Bariloche", descripcion: "Encuentro por la tarde en el alojamiento, presentación con los guías, prueba de bicicletas y cena de bienvenida." },
        { dia: 2, titulo: "Circuito Chico + Arrayanes", descripcion: "45 km por el Circuito Chico, con almuerzo y cruce en catamarán hacia Arrayanes y la Península Quetrihué." },
        { dia: 3, titulo: "Villa La Angostura → Villa Traful", descripcion: "57 km pasando por los lagos Espejo y Correntoso hasta Villa Traful, con picnic en el camino." },
        { dia: 4, titulo: "Villa Traful → Lago Hermoso", descripcion: "68 km por los lagos Villarino, Falkner y Hermoso, con picnic durante el recorrido." },
        { dia: 5, titulo: "Lago Hermoso → San Martín de los Andes", descripcion: "Media jornada en bicicleta: 37 km con un descenso final de 15 km, almuerzo y fin de servicios." }
      ],
      alojamiento: "4 noches en hotel 4 estrellas",
      comidas: "Cena el día 1, todas las comidas los días 2 a 4, desayuno y almuerzo el día 5",
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
  {
    id: "patagonia-doble-cruce-cordillera-ebike",
    esPlaceholder: false,
    publicado: true,
    tipo: "travesia",
    nombre: "Doble Cruce de la Cordillera — E-bike",
    destino: "san-martin-de-los-andes",
    categoria: "E-bike",
    imagen: "assets/img/experiencias/Cerro Capilla.jpg",
    galeria: ["assets/img/experiencias/Cerro Capilla.jpg"],
    resumen: "5 días en e-bike con dos cruces de los Andes entre Argentina y Chile, por el Parque Nacional Lanín, lagos y termas.",
    descripcion: "Dos cruces de la cordillera de los Andes en e-bike, entre la Patagonia argentina y chilena: senderos de comunidad mapuche y el Parque Nacional Lanín, una navegación por el lago Pirihueico y una caminata hasta la cascada Huilo-Huilo, bosques andino-patagónicos y valdivianos, y un segundo cruce cordillerano de regreso a San Martín de los Andes. Cinco días, unos 200 km, mayormente por caminos de gravel.",
    incluye: ["Bicicletas", "Traslados", "Guías", "Vehículo de apoyo", "Catamarán", "4 noches en cabañas/hotel", "Cena el día 1", "Todas las comidas los días 2, 3 y 4", "Desayuno y almuerzo el día 5", "Seguro", "Traslado de equipaje"],
    noIncluye: ["Alcohol", "Propinas"],
    duracion: "5 días / 4 noches",
    modalidad: "Salida grupal",
    ubicacion: "San Martín de los Andes, Argentina — Chile",
    infoImportante: null,
    precio: null,
    destacada: true,

    detalle: {
      dificultad: "Media +",
      distanciaTotal: "200 km · 75% gravel · 25% asfalto",
      fechas: ["24 – 28 feb 2027"],
      itinerario: [
        { dia: 1, titulo: "San Martín de los Andes", descripcion: "Encuentro por la tarde en el alojamiento, presentación con los guías y prueba de bicicletas." },
        { dia: 2, titulo: "San Martín → Hua Hum", descripcion: "48 km por senderos de comunidad mapuche y camino de gravel, dentro del Parque Nacional Lanín." },
        { dia: 3, titulo: "Hua Hum → Neltume", descripcion: "22 km y primer cruce de los Andes, con navegación por el lago Pirihueico y una caminata hasta la cascada Huilo-Huilo." },
        { dia: 4, titulo: "Neltume → Coñaripe", descripcion: "61 km pasando por el lago Neltume y la Cuesta de los Añiques." },
        { dia: 5, titulo: "Coñaripe → Paso Mamuil Malal → San Martín", descripcion: "70 km con el segundo cruce cordillerano, ascenso y gravel, almuerzo y transferencia final a San Martín de los Andes." }
      ],
      alojamiento: "4 noches en cabañas/hotel",
      comidas: "Cena el día 1, todas las comidas los días 2, 3 y 4, desayuno y almuerzo el día 5",
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
  {
    id: "patagonia-cruce-andino-lagos-chile-ebike",
    esPlaceholder: false,
    publicado: true,
    tipo: "travesia",
    nombre: "Cruce Andino × Lagos a Chile — E-bike",
    destino: "bariloche",
    categoria: "E-bike",
    imagen: "assets/img/experiencias/Lago Moreno, Colonia Suiza.jpeg",
    imagenPos: "center 5%",
    galeria: ["assets/img/experiencias/Lago Moreno, Colonia Suiza.jpeg"],
    resumen: "6 días combinando e-bike y navegación entre Bariloche y los lagos chilenos, con Termas de Puyehue y regreso a Argentina.",
    descripcion: "El clásico Cruce Andino combinado con e-bike: navegación desde Bariloche hasta Puerto Blest y Puerto Frías, cruce a Chile y descenso hacia Peulla navegando el lago Todos los Santos. Del otro lado, ciclovías junto al lago Llanquihue, caminos entre lagos y campos hasta Puerto Octay y el lago Rupanco, con una parada en las Termas de Puyehue antes de cruzar de regreso a Bariloche. Seis días, unos 250 km en e-bike combinados con varias navegaciones.",
    incluye: ["Bicicletas", "Traslados", "Guías", "Vehículo de apoyo", "Catamarán", "5 noches en cabañas/hotel", "Cena el día 1", "Todas las comidas de los días 2 a 5", "Desayuno y almuerzo el día 6", "Seguro", "Traslado de equipaje"],
    noIncluye: ["Alcohol", "Propinas"],
    duracion: "6 días / 5 noches",
    modalidad: "Salida grupal",
    ubicacion: "Bariloche, Argentina — Chile",
    infoImportante: null,
    precio: null,
    destacada: false,

    detalle: {
      dificultad: "Media +",
      distanciaTotal: "250 km · 80% asfalto · 20% gravel",
      fechas: ["3 – 8 dic 2026"],
      itinerario: [
        { dia: 1, titulo: "Bariloche", descripcion: "Encuentro por la tarde en el alojamiento, prueba de bicicletas y cena de bienvenida." },
        { dia: 2, titulo: "Bariloche → Puerto Blest → Petrohué", descripcion: "33 km en bicicleta combinados con una navegación inicial hasta Puerto Blest, 3 km más hasta Puerto Frías y una navegación de aproximadamente 40 minutos cruzando a Chile. Luego, 30 km hasta Peulla navegando el lago Todos los Santos. Noche en Petrohué." },
        { dia: 3, titulo: "Petrohué → Puerto Varas", descripcion: "60 km por la ciclovía de Ensenada junto al lago Llanquihue." },
        { dia: 4, titulo: "Puerto Varas → Puerto Octay", descripcion: "55 km por caminos internos entre lagos y campos, con almuerzo en Frutillar antes de llegar a Puerto Octay." },
        { dia: 5, titulo: "Puerto Octay → Lago Rupanco → Puyehue", descripcion: "Media jornada en bicicleta (40 km) y traslado a las Termas de Puyehue, con alojamiento en un hotel emblemático." },
        { dia: 6, titulo: "Termas de Puyehue → Aduana Argentina → Bariloche", descripcion: "60 km: 43 km de ascenso hasta el límite y 17 km de descenso hasta la Aduana Argentina, con traslado final a Bariloche y llegada aproximada a las 20:00." }
      ],
      alojamiento: "5 noches en cabañas/hotel",
      comidas: "Cena el día 1, todas las comidas de los días 2 a 5, desayuno y almuerzo el día 6",
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
  {
    id: "patagonia-pehuenia-chile-mtb",
    esPlaceholder: false,
    publicado: true,
    tipo: "travesia",
    nombre: "Pehuenia + Chile — Pedaleando entre Araucarias",
    destino: "villa-pehuenia",
    categoria: "MTB",
    imagen: "assets/img/patagonia.jpg",
    galeria: ["assets/img/patagonia.jpg"],
    resumen: "6 días de MTB por Villa Pehuenia y Chile, entre bosques de araucarias, volcanes, lagos y un cruce fronterizo por el paso Icalma.",
    descripcion: "Una travesía de mountain bike por Villa Pehuenia y sus alrededores, entre cerros, playas de arena blanca, bosques de araucarias milenarias y paisajes cordilleranos. El recorrido pasa por la Laguna Corazón, los senderos de bosque antiguo de Moquehue, el volcán Batea Mahuida —con opción de trekking hasta la cumbre— y un cruce fronterizo a Chile por el paso Icalma junto al lago del mismo nombre, antes de cerrar con un recorrido por lagunas de regreso a San Martín de los Andes.",
    incluye: ["Bicicletas", "Traslados", "Guías", "Vehículo de apoyo", "5 noches de hotel", "Cena el día 1", "Todas las comidas de los días 2 a 5", "Desayuno y almuerzo el día 6", "Traslado de equipaje"],
    noIncluye: ["Alcohol", "Propinas"],
    duracion: "6 días / 5 noches",
    modalidad: "Salida grupal",
    ubicacion: "Villa Pehuenia, Neuquén, Argentina — Chile",
    infoImportante: null,
    precio: null,
    destacada: false,

    detalle: {
      dificultad: "Media +",
      distanciaTotal: "220 km · 50% gravel · 50% asfalto",
      fechas: ["24 – 29 nov 2026"],
      itinerario: [
        { dia: 1, titulo: "San Martín → Villa Pehuenia", descripcion: "Encuentro después del mediodía y traslado de aproximadamente 5 horas, con presentación de los guías y prueba de bicicletas." },
        { dia: 2, titulo: "Laguna Corazón", descripcion: "60 km con un desnivel aproximado de +600 m: un desvío hacia el Paso El Arco de unos 11 km y un ascenso de 15 km por gravel hasta la laguna, donde se almuerza antes de descender por el mismo camino." },
        { dia: 3, titulo: "Senderos de Moquehue", descripcion: "54 km por senderos entre bosque antiguo, con cruces de ríos y árboles caídos, y almuerzo junto al lago Moquehue. Noche de hotel." },
        { dia: 4, titulo: "Volcán Batea Mahuida", descripcion: "34 km, con 7 km de camino y 7 km de ascenso por gravel, más un trekking opcional de aproximadamente 45 minutos hasta la cumbre. Almuerzo en el bosque y descenso en bicicleta." },
        { dia: 5, titulo: "Cruce Paso Icalma", descripcion: "54 km hasta la frontera (8 km de camino y trámites de aduana), con descenso hasta Icalma y 20 km junto al lago del mismo nombre. Picnic y regreso." },
        { dia: 6, titulo: "Vuelta por la península y las lagunas", descripcion: "Media jornada (15 km) recorriendo lagunas, con almuerzo de cierre y traslado final a San Martín de los Andes, con llegada aproximada a las 21:00." }
      ],
      alojamiento: "5 noches de hotel",
      comidas: "Cena el día 1, todas las comidas de los días 2 a 5, desayuno y almuerzo el día 6",
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
  {
    id: "patagonia-domuyo-norte-neuquino",
    esPlaceholder: false,
    publicado: true,
    tipo: "travesia",
    nombre: "Domuyo — Norte Neuquino / Techo de la Patagonia con E-bikes",
    destino: "norte-neuquino",
    categoria: "E-bike",
    imagen: "assets/img/trekking.jpg",
    imagenPos: "center 20%",
    galeria: ["assets/img/trekking.jpg"],
    resumen: "Travesía en e-bike por el norte neuquino, con base en Varvarco: volcanes, lagunas glaciares, cavernas y aguas termales.",
    descripcion: "Una travesía en e-bike por el norte neuquino, con base en el entorno de Varvarco, atravesando paisajes de montaña, zonas de trashumancia, volcanes, aguas termales y valles glaciares. El recorrido incluye las lagunas glaciares de Epulaufquen, cascadas junto al río, formaciones geológicas en Los Bolillos y un cierre en cavernas y aguas termales naturales en el Cajón del Covunco y el Cajón del Atreuco, con base en Chos Malal.",
    incluye: ["E-bike", "Traslados", "Guías", "Vehículo de apoyo", "7 noches", "Cena el día 1", "Todas las comidas de los días siguientes"],
    noIncluye: ["Alcohol", "Propinas"],
    duracion: "8 días / 7 noches",
    modalidad: "Salida grupal",
    ubicacion: "Norte neuquino · Neuquén",
    infoImportante: "La duración confirmada según el itinerario es de 8 días / 7 noches. El rango de fechas indicado (27 de marzo al 2 de abril de 2027) cubre 7 días de calendario: la fecha final está sujeta a confirmación.",
    precio: null,
    destacada: false,

    detalle: {
      dificultad: "Media +",
      distanciaTotal: "290 km · 70% gravel · 30% asfalto",
      fechas: ["27 mar — 2 abr 2027"],
      fechasNota: "A confirmar",
      itinerario: [
        { dia: 1, titulo: "Chos Malal", descripcion: "Encuentro después del mediodía, presentación del guía, prueba de bicicletas y cena de bienvenida." },
        { dia: 2, titulo: "Chos Malal → Andacollo → Mallín Malal", descripcion: "Traslado de aproximadamente 1 hora hasta Andacollo y ruta en bicicleta de unos 43 km junto al río Nahueve (asfalto y gravel, desnivel +600/-250 m) hasta Mallín Malal. Distancia total del día: 53 km." },
        { dia: 3, titulo: "Lagunas de Epulaufquen", descripcion: "70 km por gravel hasta dos lagunas de origen glaciar, con ascensos suaves, recorrido junto al río y un trekking hasta unas cascadas (desnivel +300/-300 m). Regreso por el mismo camino." },
        { dia: 4, titulo: "Mallín Malal → Las Ovejas → Varvarco", descripcion: "45 km por la Ruta 39 junto al río Neuquén, con desnivel +600/-500 m." },
        { dia: 5, titulo: "Manzano Amargo y cascadas", descripcion: "55 km junto al río hasta unas cascadas, con almuerzo y regreso (desnivel +800/-550 m)." },
        { dia: 6, titulo: "Los Bolillos", descripcion: "Media jornada (30 km) entre formaciones geológicas, con un pequeño trekking y la opción de ver el atardecer desde las antenas (desnivel +300/-150 m)." },
        { dia: 7, titulo: "Cavernas y aguas calientes", descripcion: "Traslado en vehículo de aproximadamente 1 hora y recorrido en bicicleta (37 km, desnivel +700/-400 m) por el Cajón del Covunco, con cavernas, y el Cajón del Atreuco, con aguas termales naturales." },
        { dia: 8, titulo: "Regreso", descripcion: "Desayuno y traslado a Chos Malal, de aproximadamente 2 horas." }
      ],
      alojamiento: "7 noches",
      comidas: "Cena el día 1 y todas las comidas los días siguientes",
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
    publicado: false,
    tipo: "paquete",
    nombre: "[Ejemplo] Ruta andina integral",
    destino: "cusco",
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
  return PROPUESTAS.filter(p => p.destino === slug && p.publicado);
}

/* Filtro central de "qué puede mostrarse en producción": todo listado
   público (Home, catálogos, filtros, fichas) debe pasar por acá en vez
   de mirar esPlaceholder directamente — esPlaceholder identifica
   contenido de ejemplo, publicado identifica si ya está habilitado
   para mostrarse (ver nota al principio del archivo). */
function getPropuestasPublicadas(lista){
  return (lista || PROPUESTAS).filter(p => p.publicado);
}

function getCategorias(lista){
  const base = lista || PROPUESTAS;
  return [...new Set(base.map(p => p.categoria))];
}
