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

    await use(page);

    expect(jsErrors, `Errores JS no capturados: ${jsErrors.join(" | ")}`).toEqual([]);
  },
});

module.exports = { test, expect };
