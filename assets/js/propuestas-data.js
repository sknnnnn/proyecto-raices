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

  /* ---------------- TOURS — CUSCO / PERÚ ---------------- */
  {
    id: "cusco-city-tour",
    esPlaceholder: false,
    tipo: "tour",
    nombre: "City Tour — Guía 2 idiomas",
    destino: "peru",
    categoria: "City tour",
    imagen: "assets/img/pexels-danitza-pena-galup-8100091-18143706.jpg",
    galeria: ["assets/img/pexels-danitza-pena-galup-8100091-18143706.jpg", "assets/img/experiencias/pexels-suca-19852367.jpg"],
    resumen: "Recorrido por Qoricancha, Sacsayhuamán, Qenqo, Puca Pucara y Tambomachay, con guía en dos idiomas.",
    descripcion: "City tour por los principales sitios arqueológicos e históricos de Cusco: el Templo del Qoricancha, la fortaleza de Sacsayhuamán, Qenqo, Puca Pucara y Tambomachay.",
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
      horario: "Salidas diarias: 8:30 a 14:30, o 12:30 a 18:30",
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
    tipo: "tour",
    nombre: "Tour Mirabus — Bus Panorámico",
    destino: "peru",
    categoria: "Bus panorámico",
    imagen: "assets/img/experiencias/pexels-julia-volk-5198292.jpg",
    galeria: ["assets/img/experiencias/pexels-julia-volk-5198292.jpg", "assets/img/experiencias/pexels-roberto-carlos-yarahuaman-layme-807858060-27937625.jpg"],
    resumen: "Bus panorámico por el Centro Histórico de Cusco y los sitios arqueológicos cercanos, con salidas cada hora.",
    descripcion: "Recorrido en bus panorámico por el Centro Histórico de Cusco, Qorikancha, el Palacio de Colcampata, el Templo de San Cristóbal, Sacsayhuaman, Qenqo, Puca Pucará, un centro de rituales incas con lectura de hoja de coca, y el mirador del Cristo Blanco.",
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
      horario: "Salidas desde las 9:00 AM, cada hora",
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
    tipo: "tour",
    nombre: "Tour Valle Sagrado",
    destino: "peru",
    categoria: "Valle Sagrado",
    imagen: "assets/img/_DSC0144.jpg",
    galeria: ["assets/img/_DSC0144.jpg", "assets/img/galeria-cusco-calle.jpg"],
    resumen: "Servicio compartido guiado en dos idiomas por Pisac, Urubamba y la fortaleza de Ollantaytambo.",
    descripcion: "Recorrido guiado por el Valle Sagrado: el sitio arqueológico y mercado de Pisac, almuerzo en Urubamba, la fortaleza de Ollantaytambo y regreso vía Chincheros.",
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
      horario: "Salida 7:20 a.m.",
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
    tipo: "tour",
    nombre: "Tour Super Valle Sagrado de los Incas",
    destino: "peru",
    categoria: "Valle Sagrado",
    imagen: "assets/img/experiencias/_DSC0108.jpg",
    galeria: ["assets/img/experiencias/_DSC0108.jpg", "assets/img/experiencias/_DSC0122.jpg", "assets/img/galeria-maras.jpg"],
    resumen: "Servicio compartido guiado en dos idiomas por Chincheros, Moray, las Salineras, Urubamba y Ollantaytambo.",
    descripcion: "Recorrido ampliado por el Valle Sagrado: Chincheros, las terrazas de Moray, las Salineras, almuerzo en Urubamba, Ollantaytambo y regreso vía Pisac.",
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
      horario: "Salida 06:20 am, llegada aproximada 7:00 PM",
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
    tipo: "tour",
    nombre: "Tour Valle Sur",
    destino: "peru",
    categoria: "Valle Sur",
    imagen: "assets/img/hero-nosotros-cusco.jpg",
    galeria: ["assets/img/hero-nosotros-cusco.jpg"],
    resumen: "Servicio compartido guiado en inglés/español por Tipón, Pikillacta y Andahuaylillas.",
    descripcion: "Recorrido por el Valle Sur de Cusco: los andenes de Tipón, el sitio arqueológico de Pikillacta y la iglesia de Andahuaylillas.",
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
      horario: "Recojo 08:15–08:30 · 9:00 a 15:00 · regreso aproximado 03:00 pm",
      puntoDeEncuentro: "Recojo en tu hostal",
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
    tipo: "tour",
    nombre: "Tour Maras & Moray",
    destino: "peru",
    categoria: "Valle Sagrado",
    imagen: "assets/img/experiencias/pexels-marco-alhelm-1479977387-32141363.jpg",
    galeria: ["assets/img/experiencias/pexels-marco-alhelm-1479977387-32141363.jpg", "assets/img/_DSC0042 (1).jpg"],
    resumen: "Servicio compartido guiado en inglés/español por Chinchero, Maras y Moray.",
    descripcion: "Chinchero (3300 m aprox., vistas a la cordillera Vilcanota, Chicón 5530 m y La Verónica 5682 m, con atractivos prehispánicos, coloniales y republicanos), las Salineras de Maras y las terrazas agrícolas de Moray (3385 m aprox., a unos 7 km al suroeste de Maras y 53 km de Cusco, usadas como experimentación agrícola; la terraza más profunda llega a 150 m, con un promedio de 1,8 m por terraza y diferencias de temperatura de hasta 15 °C entre el punto más alto y el más bajo).",
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
      horario: "Recojo 8:15–8:30 · inicio 9:00 · aproximadamente 8:20 a 15:00",
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
    tipo: "tour",
    nombre: "Machupicchu en un solo día en tren",
    destino: "peru",
    categoria: "Machu Picchu",
    imagen: "assets/img/experiencias/pexels-sergei-a-1322276-2539417.jpg",
    galeria: ["assets/img/experiencias/pexels-sergei-a-1322276-2539417.jpg", "assets/img/experiencias/pexels-angel-valladares-242487480-17060856.jpg", "assets/img/experiencias/pexels-underxpossed-38263090.jpg", "assets/img/galeria-machupicchu-terrazas.jpg"],
    resumen: "Servicio compartido: traslado a Ollantaytambo, tren a Aguas Calientes y visita guiada a Machu Picchu.",
    descripcion: "Traslado a Ollantaytambo, tren Peru Rail hasta Aguas Calientes, bus hacia el Santuario, visita guiada de aproximadamente 2 horas a Machu Picchu, y regreso en bus/tren vía Ollantaytambo hasta Cusco.",
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
      horario: "Recojo 02:30–03:00 · tren Peru Rail 05:05",
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
    tipo: "tour",
    nombre: "Montaña de Colores / Vinicunca 1 día",
    destino: "peru",
    categoria: "Trekking",
    imagen: "assets/img/experiencias/pexels-teresita-ramirez-583628649-17043331.jpg",
    galeria: ["assets/img/experiencias/pexels-teresita-ramirez-583628649-17043331.jpg"],
    resumen: "Servicio compartido guiado en dos idiomas: caminata hasta Vinicunca (5070 m) y almuerzo buffet.",
    descripcion: "Salida desde hoteles/hostels hacia Cusipata (3332 m), desayuno, Phulawasipata (4633 m), caminata de aproximadamente 1,5 h / 3,50 km pasando Wiñayritty y Puca Cocha hasta Vinicunca (5070 m), tiempo libre, regreso a Phulawasipata y almuerzo buffet en Cusipata.",
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
      horario: "Recojo desde las 4:00 · regreso a Cusco aproximadamente 18:00",
      puntoDeEncuentro: "Recojo desde hoteles/hostels",
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
    tipo: "tour",
    nombre: "Cordillera Arcoíris – Palcoyo",
    destino: "peru",
    categoria: "Trekking",
    imagen: "assets/img/experiencias/pexels-davidexpedition-30228477.jpg",
    galeria: ["assets/img/experiencias/pexels-davidexpedition-30228477.jpg"],
    resumen: "Servicio compartido guiado en dos idiomas hasta el bosque de piedras de Palcoyo (4960 m).",
    descripcion: "Traslado de aproximadamente 3 h hasta Combapata vía Urcos/Cusipata/Checacupe, ascenso de aproximadamente 1 h, inicio de caminata a 4790 m pasando Wallata Q'asa, la comunidad de Palcoyo, Warsaqyani y Q'alle Q'alle hasta el bosque de piedras (4960 m), con tiempo libre antes del descenso.",
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
      horario: "Recojo 04:30–05:00 · regreso a Cusco 18:00–18:30",
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
    tipo: "tour",
    nombre: "Montaña de Colores por el Valle Rojo — Ruta Larga en Cuatrimotos",
    destino: "peru",
    categoria: "Cuatrimotos",
    imagen: "assets/img/galeria-vicunas.jpg",
    galeria: ["assets/img/galeria-vicunas.jpg"],
    resumen: "Ascenso en cuatrimoto por el Valle Rojo hasta la Montaña de Colores, con capacitación incluida.",
    descripcion: "Traslado de 2 h hasta Cusipata, desayuno, 1 h hasta Laya, introducción/capacitación de cuatrimotos, ascenso en ATV de aproximadamente 40 min por el Valle Rojo, caminata de 20 min hasta el mirador de la Montaña de Colores, tiempo libre y regreso en cuatrimotos.",
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
      horario: "Recojo 4:00–4:30 · regreso a Cusco aproximadamente 16:00",
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
    tipo: "tour",
    nombre: "Laguna Humantay Full Day",
    destino: "peru",
    categoria: "Trekking",
    imagen: "assets/img/experiencias/pexels-lyon-17505746.jpg",
    galeria: ["assets/img/experiencias/pexels-lyon-17505746.jpg"],
    resumen: "Servicio compartido guiado en dos idiomas hasta la Laguna Humantay (4200 m), al pie del nevado Salkantay.",
    descripcion: "Mollepata (2900 m), desayuno, Soraypampa (3900 m), caminata de aproximadamente 1 h hasta la Laguna Humantay (4200 m) con la montaña Humantay (5450 m) de fondo, regreso a Soraypampa con vista a la ruta Salkantay y su montaña (6271 m), y almuerzo antes de volver a Cusco.",
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
      horario: "Recojo 4:15–4:30",
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
    tipo: "tour",
    nombre: "Circuito de las 7 Lagunas de Ausangate Full Day",
    destino: "peru",
    categoria: "Trekking",
    imagen: "assets/img/experiencias/pexels-daiji-umemoto-549226763-38917638.jpg",
    galeria: ["assets/img/experiencias/pexels-daiji-umemoto-549226763-38917638.jpg"],
    resumen: "Servicio compartido guiado en dos idiomas por el circuito de 7 lagunas junto al nevado Ausangate (6380 m).",
    descripcion: "Tinke (3780 m, aproximadamente 3 h), Pacchanta (4310 m, aproximadamente 40 min), desayuno, y el circuito de 7 lagunas (aproximadamente 6,5 km / 5 h): Azulqocha, Otorongo, Alqacocha, Q'omercocha y Patacocha (4740 m), con el Ausangate (6380 m) de fondo y observación de fauna. Regreso a Pacchanta para el almuerzo, con termas opcionales.",
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
      horario: "Recojo 4:30 · regreso a Cusco aproximadamente 19:30",
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
    tipo: "tour",
    nombre: "Qeswachaka Full Day",
    destino: "peru",
    categoria: "Cultura",
    imagen: "assets/img/_DSC0036 (1).jpg",
    galeria: ["assets/img/_DSC0036 (1).jpg"],
    resumen: "Servicio compartido guiado en dos idiomas hasta el último puente colgante inca, tejido en ichu.",
    descripcion: "Cusipata (3332 m, aproximadamente 2 h), desayuno, y traslado vía Combapata/Yanahoca (aproximadamente 1,5 h) hasta el puente Qeswachaka sobre el río Apurímac: un puente colgante inca de unos 28 m elaborado con ichu, reconstruido anualmente por las comunidades de Quehue, Canas. Exploración guiada, fotos y regreso por la misma ruta, pasando por las lagunas Pampamarca, Asnacqocha, Acopía y Pomacanchi.",
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
      horario: "Recojo 4:30 · regreso a Cusco aproximadamente 17:00",
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
    tipo: "tour",
    nombre: "Waqrapukara Full Day",
    destino: "peru",
    categoria: "Trekking",
    imagen: "assets/img/destino-peru-machupicchu.jpg",
    galeria: ["assets/img/destino-peru-machupicchu.jpg"],
    resumen: "Servicio compartido guiado en dos idiomas hasta la fortaleza inca de Waqrapukara, sobre el cañón del Apurímac.",
    descripcion: "Desayuno en Cusipata (aproximadamente 6:00), ruta vía Chukicahuana/Pomacanchis pasando QuelwaQocha (4350 m), Toccorani, el cañón del Apurímac y Santa Lucía, y caminata de aproximadamente 3 h hasta Waqrapukara, con flora y fauna en el camino. En el sitio: Intipunku, plaza principal, torreones, andenería, el recinto Wiracocha, Uña Waqrapukara e Intihuatana. Regreso caminando (aproximadamente 2 h, principalmente descenso) y almuerzo.",
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
      horario: "Recojo 4:00–4:30 · regreso a Cusco aproximadamente 18:30",
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
    tipo: "tour",
    nombre: "Quelccaya – Suyuparina Full Day",
    destino: "peru",
    categoria: "Trekking",
    imagen: "assets/img/experiencias/pexels-lyon-17505746.jpg",
    galeria: ["assets/img/experiencias/pexels-lyon-17505746.jpg"],
    resumen: "Recorrido hasta un mirador a 5200 m frente al glaciar Quelccaya y la laguna Sibinacocha.",
    descripcion: "Traslado de aproximadamente 5 h hasta Phinaya (4700 m), caminata de aproximadamente 45 min hasta los 5200 m, con tiempo libre para fotos frente a lagunas cristalinas, las montañas de Vilcanota y el glaciar Quelccaya. Regreso a Phinaya para el almuerzo y visita a la laguna Sibinacocha antes de volver a Cusco.",
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
      horario: "Recojo 3:00–3:30 · regreso a Cusco aproximadamente 21:00",
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
    tipo: "tour",
    nombre: "Tours en Cuatrimotos Morada de los Dioses",
    destino: "peru",
    categoria: "Cuatrimotos",
    imagen: "assets/img/experiencias/pexels-kaushik21-26074194.jpg",
    galeria: ["assets/img/experiencias/pexels-kaushik21-26074194.jpg"],
    resumen: "Ruta en cuatrimoto con briefing de seguridad y práctica, hasta el mirador Morada de los Dioses.",
    descripcion: "Traslado privado hasta la base en Tica Tica, Sencca (aproximadamente 25 min), briefing de seguridad (5 min) y práctica (10 min), ruta en cuatrimoto de aproximadamente 45 min por trails y miradores, visita guiada a Morada de los Dioses (aproximadamente 30 min) y regreso a la base, con vehículo privado de vuelta a Cusco.",
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
      horario: "Salidas: 08:00 · 11:00 · 13:00 · 15:00",
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
    tipo: "tour",
    nombre: "Skybike, Rappel y Vía Ferrata Cachimayo",
    destino: "peru",
    categoria: "Aventura",
    imagen: "assets/img/experiencias/pexels-viviane-couto-450464801-33463618.jpg",
    galeria: ["assets/img/experiencias/pexels-viviane-couto-450464801-33463618.jpg"],
    resumen: "Vía ferrata, skybike y rappel en Cachimayo, a unos 25 minutos de Cusco.",
    descripcion: "Traslado de Cusco a Cachimayo (aproximadamente 25 min) y caminata de 10 min hasta la vía ferrata (45 m de altura). Incluye skybike (dos líneas, 250 m en total / 50 m de altura) y rappel (25 m), con snack antes del regreso.",
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
      horario: "8:30–12:30 · recojo 8:15",
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
    tipo: "tour",
    nombre: "Canoas Experience",
    destino: "patagonia",
    categoria: "Remo",
    imagen: "assets/img/vista-lago.jpg",
    galeria: ["assets/img/vista-lago.jpg"],
    resumen: "Remo en canoa por el Parque Nacional Tierra del Fuego: lago Acigami, río Lapataia y el Canal Beagle.",
    descripcion: "Recorrido en canoa de dificultad baja por el lago Acigami, el río Lapataia, la Laguna Verde, el río Ovando, el Archipiélago Cormoranes, la Bahía Lapataia y el Canal Beagle: 1:45 h en total, con 55 min de remo efectivo sobre 4,88 km. Incluye snack en un domo (pastelería y café/infusiones, con opciones vegetariana, vegana y sin gluten). Los horarios, el orden y las atracciones pueden variar según guía, grupo y clima.",
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
      horario: null,
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
    tipo: "tour",
    nombre: "Trekking y Canoas",
    destino: "patagonia",
    categoria: "Trekking & remo",
    imagen: "assets/img/camping.jpg",
    galeria: ["assets/img/camping.jpg"],
    resumen: "Combinación de trekking y canoas en el Parque Nacional Tierra del Fuego, con almuerzo de tres pasos.",
    descripcion: "Tres senderos de dificultad baja: Cañadón del Toro hasta la cascada del río Pipo (1:10 h, +30 m, 3 km), Pampa Baja hasta el final de Pampa Alta (55 min, -20 m, 1,13 km) e inicio de la senda Costera (1 h, 0 m, 3,2 km), combinados con la salida en canoa. Almuerzo de tres pasos en domo: picada argentina, estofado de carne al malbec con vino tinto/agua, y brownies con café/infusiones (con opciones vegetariana, vegana y sin gluten). Atractivos en el camino: guanacos, el río Pipo y su cascada, el Bosque de las Agujas, lenga, castoreras, arqueología Yamana y vista a la Isla Redonda. Los horarios, el orden y las atracciones pueden variar.",
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
      horario: null,
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
    tipo: "tour",
    nombre: "Ushuaia Sunset",
    destino: "patagonia",
    categoria: "Trekking",
    imagen: "assets/img/experiencias/pexels-vinegarcias-18789208.jpg",
    galeria: ["assets/img/experiencias/pexels-vinegarcias-18789208.jpg"],
    resumen: "Caminata de atardecer por la Reserva Turística Camino del Glaciar Martial, con vistas nocturnas de Ushuaia y el Beagle.",
    descripcion: "Sendero desde la Reserva Turística Camino del Glaciar Martial, atravesando bosque y turbales hasta tres miradores, con vistas nocturnas de los Andes, Ushuaia, el canal Beagle y sus islas. Experiencia disponible durante las 4 estaciones.",
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
      horario: null,
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
    tipo: "tour",
    nombre: "Estancia Túnel — Trekking",
    destino: "patagonia",
    categoria: "Trekking",
    imagen: "assets/img/experiencias/Ea Tunel E-bike 5_Original.jpg",
    galeria: ["assets/img/experiencias/Ea Tunel E-bike 5_Original.jpg"],
    resumen: "Caminata por la costa del Beagle en la reserva natural y cultural de Playa Larga, hasta la antigua Estancia Túnel.",
    descripcion: "Sendero por la costa del canal Beagle en la reserva natural y cultural de Playa Larga hasta la antigua Estancia Túnel, con historia del lugar, biodiversidad costera, un árbol bandera, notros y canelos, arbustos frutales y costas agrestes.",
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
      horario: null,
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
    tipo: "tour",
    nombre: "Balcones del Susana",
    destino: "patagonia",
    categoria: "Trekking",
    imagen: "assets/img/fauna-montana.jpg",
    galeria: ["assets/img/fauna-montana.jpg"],
    resumen: "Ascenso al Monte Susana (aproximadamente 500 m) con vistas al Parque Nacional Tierra del Fuego.",
    descripcion: "Ascenso a la cumbre del Monte Susana, una geoforma de origen glacial, con vistas al Parque Nacional Tierra del Fuego, el Cerro Guanaco, la Isla Navarino, la Isla Hoste, la Bahía Ushuaia y la Cordillera Darwin.",
    incluye: ["Traslado ida/retorno", "Guía bilingüe", "Box lunch: sandwich + snack + agua/infusión caliente"],
    noIncluye: [],
    duracion: "5 h",
    modalidad: "Salida grupal",
    ubicacion: "Ushuaia, Tierra del Fuego, Argentina",
    infoImportante: "Dificultad moderada. Desnivel 400 m, 5,5 km.",
    precio: null,
    destacada: false,
    detalle: {
      fecha: null,
      horario: null,
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
    tipo: "tour",
    nombre: "Lagunas Gemelas",
    destino: "patagonia",
    categoria: "Trekking",
    imagen: "assets/img/patagonia.jpg",
    galeria: ["assets/img/patagonia.jpg"],
    resumen: "Caminata al nordeste de la isla, junto al Paso Garibaldi, hasta dos reservorios formados por castores.",
    descripcion: "Ubicada al nordeste de la isla, sobre la Ruta 3 antes del Paso Garibaldi: bosque de altura, dos reservorios creados por castores, el mirador del Paso Garibaldi, el Lago Escondido y el Lago Khami.",
    incluye: ["Traslado ida/retorno", "Guía bilingüe", "Box lunch: sandwich + snack + agua/infusión caliente"],
    noIncluye: [],
    duracion: "5 h",
    modalidad: "Salida grupal",
    ubicacion: "Ushuaia, Tierra del Fuego, Argentina",
    infoImportante: "Dificultad moderada. Desnivel 283 m, 2,5 km.",
    precio: null,
    destacada: false,
    detalle: {
      fecha: null,
      horario: null,
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
    tipo: "tour",
    nombre: "Lagunas Gemelas Full Day",
    destino: "patagonia",
    categoria: "Trekking",
    imagen: "assets/img/patagonia.jpg",
    galeria: ["assets/img/patagonia.jpg"],
    resumen: "Versión extendida de Lagunas Gemelas: cumbre del Cerro Verde, Laguna Raquel y Laguna de los Perros.",
    descripcion: "Continúa más allá de Lagunas Gemelas hasta la cumbre del Cerro Verde, sigue por la cresta hacia la Laguna Raquel (600 m sobre la vegetación, con vistas al Cerro Negro) y desciende por el valle hasta la Laguna de los Perros, con panorámicas de lagos, montañas y lagunas.",
    incluye: ["Traslado ida/retorno", "Guía bilingüe", "Box lunch: sandwich + snack", "Agua/infusión caliente"],
    noIncluye: [],
    duracion: "7 h",
    modalidad: "Salida grupal",
    ubicacion: "Ushuaia, Tierra del Fuego, Argentina",
    infoImportante: "Dificultad alta. Desnivel 450 m, 9 km.",
    precio: null,
    destacada: false,
    detalle: {
      fecha: null,
      horario: null,
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
    tipo: "tour",
    nombre: "Trek Andino",
    destino: "patagonia",
    categoria: "Trekking",
    imagen: "assets/img/experiencias/pexels-anastasiakasina-36865249.JPG",
    galeria: ["assets/img/experiencias/pexels-anastasiakasina-36865249.JPG"],
    resumen: "Trekking de alta exigencia por la Sierra Sorondo / valle Olum, entre lagunas turquesas y la Laguna Esmeralda.",
    descripcion: "En la Sierra Sorondo, sobre el valle Olum: Laguna Turquesa, Laguna Ausente, vistas a la Sierra Alvear y Laguna Esmeralda.",
    incluye: ["Traslado ida/retorno", "Guía bilingüe", "Box lunch: sandwich + snack", "Agua/infusión caliente"],
    noIncluye: [],
    duracion: "7 h",
    modalidad: "Salida grupal",
    ubicacion: "Ushuaia, Tierra del Fuego, Argentina",
    infoImportante: "Dificultad alta. Desnivel 450 m, 12 km.",
    precio: null,
    destacada: true,
    detalle: {
      fecha: null,
      horario: null,
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
    tipo: "tour",
    nombre: "Urban Landscape",
    destino: "patagonia",
    categoria: "E-bike",
    imagen: "assets/img/experiencias/Urban E-bike 2_Original.jpg",
    galeria: ["assets/img/experiencias/Urban E-bike 2_Original.jpg"],
    resumen: "Recorrido en e-bike por sectores emblemáticos de Ushuaia y observación de aves en la Reserva Natural Bahía Encerrada.",
    descripcion: "Paisaje natural y urbano en e-bike: sectores emblemáticos de la ciudad, miradores y observación de aves en la Reserva Natural Bahía Encerrada. 15 km, desnivel 160 m.",
    incluye: ["Agua", "Barra de cereal", "Infusión caliente durante el recorrido", "Parada de snack en Laguna Café de Barrio: bebida + pastelería"],
    noIncluye: [],
    duracion: "3 h",
    modalidad: "Salida grupal",
    ubicacion: "Ushuaia, Tierra del Fuego, Argentina",
    infoImportante: "Dificultad baja. Incluye bicicleta con asistencia eléctrica, casco, anorak GoreTex, sobrepantalón impermeable y guantes de ciclismo.",
    precio: null,
    destacada: false,
    detalle: {
      fecha: null,
      horario: null,
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
    tipo: "tour",
    nombre: "Mirador del Beagle",
    destino: "patagonia",
    categoria: "E-bike",
    imagen: "assets/img/experiencias/MiradorBeagle1_Original.jpg",
    galeria: ["assets/img/experiencias/MiradorBeagle1_Original.jpg"],
    resumen: "Recorrido en e-bike por una ruta alternativa hacia el Martial, con vistas al Canal Onashaga y al glaciar.",
    descripcion: "Ruta alternativa en e-bike por bosques y turbales hacia el Martial, con vistas al Canal Onashaga y las islas al sur, y al glaciar y las montañas hacia el norte. 25 km, desnivel 350 m.",
    incluye: ["Agua", "Barra de cereal", "Infusión caliente", "Parada de snack en Laguna Café de Barrio: bebida + pastelería"],
    noIncluye: [],
    duracion: "4 h",
    modalidad: "Salida grupal",
    ubicacion: "Ushuaia, Tierra del Fuego, Argentina",
    infoImportante: "Dificultad media. Incluye bicicleta con asistencia eléctrica, casco, anorak GoreTex, sobrepantalón impermeable y guantes de ciclismo.",
    precio: null,
    destacada: false,
    detalle: {
      fecha: null,
      horario: null,
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
    tipo: "tour",
    nombre: "Estancia Túnel — E-bike",
    destino: "patagonia",
    categoria: "E-bike",
    imagen: "assets/img/experiencias/Ea Tunel E-bike 5_Original.jpg",
    galeria: ["assets/img/experiencias/Ea Tunel E-bike 5_Original.jpg"],
    resumen: "La misma ruta de Estancia Túnel, recorrida en e-bike, con transfer desde el centro de la ciudad.",
    descripcion: "Misma ruta base de Estancia Túnel, recorrida en e-bike. 11,2 km, desnivel 260 m.",
    incluye: ["Transfer ida/retorno desde ubicación comercial Deloqui 756", "Snack de sendero", "Sandwich", "Agua/bebida caliente"],
    noIncluye: [],
    duracion: "5 h",
    modalidad: "Salida grupal",
    ubicacion: "Ushuaia, Tierra del Fuego, Argentina",
    infoImportante: "Dificultad moderada/alta. Incluye bicicleta con asistencia eléctrica, casco, anorak GoreTex, sobrepantalón impermeable y guantes de ciclismo.",
    precio: null,
    destacada: false,
    detalle: {
      fecha: null,
      horario: null,
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
    tipo: "tour",
    nombre: "Cascada Beban",
    destino: "patagonia",
    categoria: "E-bike",
    imagen: "assets/img/experiencias/Beban E-bike  5_Original.jpg",
    galeria: ["assets/img/experiencias/Beban E-bike  5_Original.jpg", "assets/img/experiencias/Beban E-bike 4_Original.jpg"],
    resumen: "E-bike por el histórico sendero de Hacheros en el Valle de Tierra Mayor, hasta la Cascada Beban.",
    descripcion: "Traslado desde las oficinas hasta el antiguo sendero de Hacheros en el Valle de Tierra Mayor: un sendero histórico de extracción de leña de la década de 1940, que atraviesa el Valle Carbajal, la Sierra Sorondo y el Cerro Bonete hasta la Cascada Beban, con vista al glaciar. 12,7 km, desnivel 200 m.",
    incluye: ["Transfer ida/retorno desde Deloqui 756", "Snack de sendero", "Sandwich", "Agua/bebida caliente"],
    noIncluye: [],
    duracion: "6 h",
    modalidad: "Salida grupal",
    ubicacion: "Ushuaia, Tierra del Fuego, Argentina",
    infoImportante: "Dificultad moderada/alta. Incluye bicicleta con asistencia eléctrica, casco, anorak GoreTex, sobrepantalón impermeable y guantes de ciclismo.",
    precio: null,
    destacada: false,
    detalle: {
      fecha: null,
      horario: null,
      puntoDeEncuentro: "Deloqui 756",
      combinableConOtrosTours: false,
      seConvierteEnTravesiaAlCombinar: false,
      duracionCombinada: null,
      itinerarioCombinado: [],
      recorrido: ["Traslado hasta el antiguo sendero de Hacheros, Valle de Tierra Mayor", "Sendero histórico de extracción de leña (década de 1940)", "Valle Carbajal", "Sierra Sorondo", "Cerro Bonete", "Cascada Beban", "Vista al glaciar"]
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
