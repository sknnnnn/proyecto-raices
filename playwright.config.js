const { defineConfig, devices } = require("@playwright/test");

/*
 * Config minima de Playwright para PRO-51.
 *
 * El sitio no tiene build tooling: estos tests corren contra un
 * servidor estatico local (tests/support/static-server.js), no contra
 * la version publicada. Supabase/CDN no son alcanzables desde este
 * entorno, asi que por ahora los tests deben limitarse a lo que no
 * depende de datos en vivo (estructura estatica: nav, hero, footer,
 * breadcrumbs con contexto simulado por URL, etc.). Tests que
 * necesiten datos reales de Supabase van a requerir mockear
 * supabase-client.js / data-api.js via page.route(), como ya se hizo
 * en las sesiones de QA manual anteriores.
 */
module.exports = defineConfig({
  testDir: "./tests",
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // Playwright usa la mitad de los cores como default (6 en esta máquina
  // de 12 cores) — ese nivel de paralelismo satura I/O/CPU en este
  // entorno y vuelve intermitente incluso goto(..., {waitUntil:
  // "domcontentloaded"}) (ver tests/support/fixtures.js). Con 2 workers
  // la suite corre estable y limpia en ~13s; no es un timeout más alto,
  // es menos contención simultánea.
  workers: 2,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "node tests/support/static-server.js",
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 15000,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
});
