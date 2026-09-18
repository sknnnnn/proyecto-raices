const { test, expect } = require("@playwright/test");

/*
 * Smoke test minimo (PRO-51, paso 1): confirma que Playwright puede
 * abrir el sitio servido localmente y que la home carga su estructura
 * base. Deliberadamente NO depende de datos de Supabase (no hay acceso
 * de red a Supabase/CDN desde este entorno) - solo verifica HTML
 * estatico que siempre esta presente.
 */
test("la home carga y muestra la estructura base", async ({ page }) => {
  const pageErrors = [];
  page.on("pageerror", (err) => pageErrors.push(err.message));

  // domcontentloaded en vez del "load" por defecto: no depende de que
  // terminen de descargar/decodificar las imágenes pesadas de la home
  // (ver mismo criterio en tests/support/fixtures.js). Este spec no usa
  // ese fixture a propósito (sin mocks, HTML real), así que lo pide acá.
  const response = await page.goto("/index.html", { waitUntil: "domcontentloaded" });
  expect(response.status(), "index.html deberia responder 200").toBe(200);

  await expect(page).toHaveTitle(/Proyecto Ra[íi]ces/i);

  const nav = page.locator("header nav");
  await expect(nav).toBeVisible();
  await expect(nav.locator(".brand img")).toBeVisible();

  await expect(page.locator("footer")).toBeVisible();
  await expect(page.locator("#footer-year")).toBeVisible();

  expect(pageErrors, `Errores JS no capturados: ${pageErrors.join(" | ")}`).toEqual([]);
});
