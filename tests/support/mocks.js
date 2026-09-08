/*
 * Datos mínimos + instalador de mocks para la suite de Playwright.
 *
 * El sitio habla con Supabase únicamente a través de
 * assets/js/supabase-client.js y assets/js/data-api.js (capa única de
 * acceso a datos, ver ese archivo). En vez de reproducir el formato
 * REST/embedding de Supabase, interceptamos esos dos <script> (más el
 * SDK de jsdelivr) y servimos versiones falsas con el mismo contrato
 * público (mismos métodos de DataAPI, mismo shape de objetos) pero con
 * datos fijos en memoria. Esto mantiene los tests determinísticos y
 * sin red real, sin tocar ningún archivo de producción.
 *
 * Dataset deliberadamente chico: sólo lo necesario para cubrir los
 * flujos de la suite (navegación, Experiencias → Cusco → catálogo →
 * detalle, filtros, Tours/Travesías/Paquetes). No es una réplica de la
 * base real.
 */

const MOCK_DESTINOS = [
  { id: "d-cusco", slug: "cusco", nombre: "Cusco", pais: "Perú", region: "Cusco", grupo: "internacional", imagen: "assets/img/destino-peru-machupicchu.jpg", imagenPos: "center 55%", resumen: "Ciudadelas incas y montañas.", esPlaceholder: false, orden: 1, cantidadExperiencias: 4, disponible: true },
  { id: "d-bariloche", slug: "bariloche", nombre: "Bariloche", pais: "Argentina", region: null, grupo: "argentina", imagen: "assets/img/destino-patagonia.jpg", imagenPos: "center 32%", resumen: "Lagos y montaña patagónica.", esPlaceholder: false, orden: 2, cantidadExperiencias: 1, disponible: true }
];

const MOCK_ACTIVIDADES = [
  { id: "a-trekking", slug: "trekking", nombre: "Trekking" }
];

const MOCK_EXPERIENCIAS = [
  {
    id: "e-city-tour", slug: "cusco-city-tour", nombre: "City Tour — Guía 2 idiomas", tipoProducto: "tour",
    destinoId: "d-cusco", destino: MOCK_DESTINOS[0], actividades: [],
    resumen: "Recorrido por Qoricancha y Sacsayhuamán.", descripcion: "Un recorrido por los sitios arqueológicos de Cusco.",
    duracion: "Medio día", modalidad: "Compartido", ubicacion: "Cusco", precio: null,
    publicado: true, esPlaceholder: false, destacada: false,
    imagen: "assets/img/pexels-danitza-pena-galup-8100091-18143706.jpg", imagenPos: null, orden: 1,
    incluye: ["Guía profesional"], noIncluye: [], infoImportante: null, detalle: {}
  },
  {
    id: "e-skybike", slug: "cusco-skybike-cachimayo", nombre: "Skybike, Vía Ferrata y Rappel en Cachimayo", tipoProducto: "tour",
    destinoId: "d-cusco", destino: MOCK_DESTINOS[0], actividades: [],
    resumen: "Skybike, rappel y vía ferrata en Cachimayo.", descripcion: "Un traslado a Cachimayo para tres actividades de altura.",
    duracion: "Medio día", modalidad: "Compartido", ubicacion: "Cusco", precio: null,
    publicado: true, esPlaceholder: false, destacada: false,
    imagen: "assets/img/experiencias/pexels-viviane-couto-450464801-33463618.jpg", imagenPos: null, orden: 2,
    incluye: ["Equipo", "Casco"], noIncluye: [], infoImportante: null, detalle: {}
  },
  {
    id: "e-salkantay", slug: "peru-salkantay-trek", nombre: "Salkantay Trek", tipoProducto: "travesia",
    destinoId: "d-cusco", destino: MOCK_DESTINOS[0], actividades: [MOCK_ACTIVIDADES[0]],
    resumen: "Trekking de varios días hasta Machupicchu.", descripcion: "Cruzando el nevado Salkantay hasta el Valle Sagrado.",
    duracion: "5 días / 4 noches", modalidad: "Grupal", ubicacion: "Cusco", precio: null,
    publicado: true, esPlaceholder: false, destacada: false,
    imagen: "assets/img/experiencias/pexels-davidexpedition-30228477.jpg", imagenPos: "center 68%", orden: 3,
    incluye: ["Guía profesional bilingüe"], noIncluye: ["Vuelos"], infoImportante: null, detalle: {}
  },
  {
    id: "e-paquete", slug: "andes-peru-ejemplo", nombre: "Ruta andina integral", tipoProducto: "paquete",
    destinoId: "d-cusco", destino: MOCK_DESTINOS[0], actividades: [],
    resumen: "Paquete de varios días con todo resuelto.", descripcion: "Un recorrido integral por Cusco y el Valle Sagrado.",
    duracion: "7 días", modalidad: "Paquete a medida", ubicacion: "Perú", precio: null,
    publicado: true, esPlaceholder: false, destacada: false,
    imagen: "assets/img/hero-paquetes-machupicchu.jpg", imagenPos: null, orden: 4,
    incluye: ["Alojamiento", "Traslados"], noIncluye: [], infoImportante: null, detalle: {}
  },
  {
    id: "e-campanario", slug: "bariloche-cerro-campanario", nombre: "Cerro Campanario", tipoProducto: "tour",
    destinoId: "d-bariloche", destino: MOCK_DESTINOS[1], actividades: [],
    resumen: "Vista panorámica de los lagos de Bariloche.", descripcion: "Subida en aerosilla al mirador del Cerro Campanario.",
    duracion: "Medio día", modalidad: "Compartido", ubicacion: "Bariloche", precio: null,
    publicado: true, esPlaceholder: false, destacada: false,
    imagen: "assets/img/experiencias/Desde Mirador Cerro Campanario.JPG", imagenPos: "center 55%", orden: 5,
    incluye: ["Aerosilla"], noIncluye: [], infoImportante: null, detalle: {}
  }
];

const MOCK_GALERIA = {
  "e-city-tour": [{ url: "assets/img/pexels-danitza-pena-galup-8100091-18143706.jpg", orden: 0, foco: null, alt: null }]
};

const MOCK_EQUIPO = [
  { id: "m-santi", nombre: "Santiago", rol: null, descripcion: null, imagen: "assets/img/santi.png", imagenPos: "center 25%", orden: 1 }
];

const MOCK_SITE_CONFIG = {
  nombre: "Proyecto Raíces", dominio: "https://proyectoraices.com.ar", email: "proyectoraicestravel@gmail.com",
  whatsapp: "5492804971939", instagram: "@proyectotravesia", instagramUrl: "https://instagram.com/proyectotravesia",
  tiktok: "@proyectotravesia", tiktokUrl: "https://www.tiktok.com/@proyectotravesia",
  horarios: [{ dias: "Lunes a Viernes", horas: "8:00 – 20:00" }], ubicacionBase: "Buenos Aires, Argentina",
  nosotrosTexto: "Somos un equipo que arma experiencias de aventura.", fraseHero: "Creamos y seleccionamos experiencias."
};

function buildDataApiScript() {
  return `
const MOCK_DESTINOS = ${JSON.stringify(MOCK_DESTINOS)};
const MOCK_ACTIVIDADES = ${JSON.stringify(MOCK_ACTIVIDADES)};
const MOCK_EXPERIENCIAS = ${JSON.stringify(MOCK_EXPERIENCIAS)};
const MOCK_GALERIA = ${JSON.stringify(MOCK_GALERIA)};
const MOCK_EQUIPO = ${JSON.stringify(MOCK_EQUIPO)};
const MOCK_SITE_CONFIG = ${JSON.stringify(MOCK_SITE_CONFIG)};

const DataAPI = {
  async getDestinosActivos() { return MOCK_DESTINOS; },
  async getDestinoPorSlug(slug) { return MOCK_DESTINOS.find(d => d.slug === slug) || null; },
  async getActividades() { return MOCK_ACTIVIDADES; },
  async getExperienciasPublicadas({ tipo, destinoSlug, actividadSlug } = {}) {
    return MOCK_EXPERIENCIAS.filter(p => p.publicado).filter(p => {
      if (tipo && p.tipoProducto !== tipo) return false;
      if (destinoSlug && (!p.destino || p.destino.slug !== destinoSlug)) return false;
      if (actividadSlug && !p.actividades.some(a => a.slug === actividadSlug)) return false;
      return true;
    });
  },
  async getExperienciaPorSlug(slug) { return MOCK_EXPERIENCIAS.find(e => e.slug === slug) || null; },
  async getExperienciasPorDestino(slug) { return this.getExperienciasPublicadas({ destinoSlug: slug }); },
  async getGaleria(experienciaId) { return MOCK_GALERIA[experienciaId] || []; },
  async getExperienciasDeUnPaquete() { return []; },
  async getEquipoActivo() { return MOCK_EQUIPO; },
  async getSiteConfig() { return MOCK_SITE_CONFIG; }
};
`;
}

const SUPABASE_CLIENT_SCRIPT = "const supabaseClient = {};";
const SDK_STUB_SCRIPT = "window.supabase = { createClient: () => ({}) };";

/* Instala los 3 route() necesarios en la página dada. Se llama una vez
   por test (ver tests/support/fixtures.js), antes de cualquier goto(). */
async function installMocks(page) {
  await page.route("https://cdn.jsdelivr.net/**", (route) =>
    route.fulfill({ status: 200, contentType: "application/javascript", body: SDK_STUB_SCRIPT })
  );
  await page.route("**/assets/js/supabase-client.js", (route) =>
    route.fulfill({ status: 200, contentType: "application/javascript", body: SUPABASE_CLIENT_SCRIPT })
  );
  await page.route("**/assets/js/data-api.js", (route) =>
    route.fulfill({ status: 200, contentType: "application/javascript", body: buildDataApiScript() })
  );
  // Las fuentes externas (Google Fonts / cdnfonts) están bloqueadas por el
  // proxy de este entorno. Un <link rel="stylesheet"> pendiente ANTES de
  // los <script> del <head> bloquea su ejecución (y por lo tanto
  // DOMContentLoaded) hasta resolver — y el proxy a veces corta rápido y
  // a veces cuelga, lo que volvía la navegación intermitente. Se
  // responden al toque con un stub vacío para que nunca bloqueen.
  await page.route("https://fonts.googleapis.com/**", (route) =>
    route.fulfill({ status: 200, contentType: "text/css", body: "/* fonts mocked for tests */" })
  );
  await page.route("https://fonts.cdnfonts.com/**", (route) =>
    route.fulfill({ status: 200, contentType: "text/css", body: "/* fonts mocked for tests */" })
  );
}

module.exports = { installMocks, MOCK_DESTINOS, MOCK_EXPERIENCIAS };
