const { test, expect } = require("./support/fixtures");

/*
 * PRO-52 — Test mínimo de wiring de Sentry.
 *
 * assets/js/sentry-init.js todavía tiene SENTRY_DSN="COMPLETAR" (no hay
 * proyecto en sentry.io creado aún), así que en producción real
 * Sentry.init() NO se ejecuta — eso se verifica en el primer test, con
 * el archivo real, sin mocks. El segundo test verifica que, cuando SÍ
 * hay un DSN configurado, la llamada a Sentry.init() se hace con los
 * parámetros esperados: para eso sustituye sentry-init.js por un DSN de
 * prueba vía page.route(), mismo mecanismo que ya usa
 * tests/support/mocks.js para supabase-client.js/data-api.js.
 */

test("sin DSN configurado (placeholder), Sentry.init() no se llama", async ({ page }) => {
  const initCalls = [];
  await page.addInitScript(() => {
    window.Sentry = { init: (opts) => { window.__sentryInitCalls = window.__sentryInitCalls || []; window.__sentryInitCalls.push(opts); } };
  });

  await page.goto("/index.html");
  await page.waitForTimeout(300);

  const calls = await page.evaluate(() => window.__sentryInitCalls || []);
  expect(calls).toEqual([]);
});

test("con un DSN configurado, Sentry.init() se llama con dsn y environment", async ({ page }) => {
  const FAKE_DSN = "https://fake@o0.ingest.sentry.io/0";

  await page.addInitScript(() => {
    window.Sentry = { init: (opts) => { window.__sentryInitCalls = window.__sentryInitCalls || []; window.__sentryInitCalls.push(opts); } };
  });

  // Mismo sentry-init.js real, sólo con SENTRY_DSN reemplazado por uno
  // de prueba — no se toca el archivo en disco, sólo la respuesta que
  // recibe esta página durante el test.
  const fs = require("fs");
  const path = require("path");
  const realSource = fs.readFileSync(path.join(__dirname, "..", "assets", "js", "sentry-init.js"), "utf8");
  const testSource = realSource.replace('const SENTRY_DSN = "COMPLETAR";', `const SENTRY_DSN = "${FAKE_DSN}";`);
  expect(testSource).not.toBe(realSource); // si esto falla, el replace no encontró el placeholder

  await page.route("**/assets/js/sentry-init.js", (route) =>
    route.fulfill({ status: 200, contentType: "application/javascript", body: testSource })
  );

  await page.goto("/index.html");
  await page.waitForTimeout(300);

  const calls = await page.evaluate(() => window.__sentryInitCalls || []);
  expect(calls).toHaveLength(1);
  expect(calls[0].dsn).toBe(FAKE_DSN);
  expect(calls[0].environment).toBe("development"); // host de test no es proyectoraices.com.ar
});
