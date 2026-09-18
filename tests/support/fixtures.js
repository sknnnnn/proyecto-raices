/*
 * Fixture compartido por toda la suite (Test 5 — Errores JS):
 * - instala los mocks de Supabase antes de cualquier goto();
 * - escucha "pageerror" durante todo el test;
 * - al terminar el test, falla si se capturó algún error JS no manejado.
 *
 * Aplicarlo automáticamente acá (en vez de un spec aparte) cubre los
 * 5 tests de la suite, no solo uno — cualquier flujo que use este
 * "test" queda validado contra errores JS.
 */
const { test: base, expect } = require("@playwright/test");
const { installMocks } = require("./mocks");

const test = base.extend({
  page: async ({ page }, use) => {
    const jsErrors = [];
    page.on("pageerror", (err) => jsErrors.push(err.message));

    await installMocks(page);

    // waitUntil por defecto de Playwright es "load": exige que terminen de
    // descargar/decodificar TODAS las imágenes de la página. Con las fotos
    // pesadas del sitio (varias de 8-14MB, sin optimizar) eso vuelve la
    // navegación intermitente bajo los workers en paralelo, sin relación
    // con si la UI ya está lista para testear — el DOM (incluido el
    // contenido que arma main.js desde DataAPI) ya está armado en
    // "domcontentloaded", y de ahí en más el auto-waiting de los
    // locators/expect de cada test cubre el resto. Un test puede seguir
    // pidiendo otra estrategia pasándola explícita como 2do argumento.
    const originalGoto = page.goto.bind(page);
    page.goto = (url, options) => originalGoto(url, { waitUntil: "domcontentloaded", ...options });

    await use(page);

    expect(jsErrors, `Errores JS no capturados: ${jsErrors.join(" | ")}`).toEqual([]);
  },
});

module.exports = { test, expect };
