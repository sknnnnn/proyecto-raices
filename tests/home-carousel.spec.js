const { test, expect } = require("./support/fixtures");

/*
 * Carrusel de Experiencias de Inicio (index.html):
 * - loop infinito: el riel se duplica y el autoplay vuelve al inicio al
 *   llegar al final de un set;
 * - al cambiar el tamaño de la ventana / girar el dispositivo el ancho
 *   del set se vuelve a medir (antes quedaba con el ancho viejo y el
 *   autoplay se trababa al final);
 * - con pocas experiencias (un set completo entra en el viewport) no se
 *   duplica la pista ni hay autoplay, flechas ni contador.
 *
 * Con los mocks de tests/support/mocks.js: 5 experiencias con foto
 * (3 tours, 1 travesía, 1 paquete).
 */

const viewport = "#exp-home-viewport";
const cards = "#exp-home-track .exp-feature";
const nav = "#exp-home-carousel .exp-carousel-nav";
const counter = "#exp-home-counter";

test("Carrusel de Inicio: tras cambiar el tamaño de la ventana el loop no queda trabado", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/index.html");

  // 5 experiencias, duplicadas para el loop.
  await expect(page.locator(cards)).toHaveCount(10);
  await expect(page.locator(nav)).toBeVisible();

  // Se achica a mobile (rotar/redimensionar): el loop sigue activo.
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(cards)).toHaveCount(10);
  await expect(page.locator(nav)).toBeVisible();

  // Se lleva el riel al final: el autoplay tiene que volver al inicio del
  // set (con el ancho viejo de desktop nunca llegaba y quedaba trabado).
  const max = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    el.scrollLeft = el.scrollWidth;
    return el.scrollLeft;
  }, viewport);
  expect(max).toBeGreaterThan(0);
  await expect
    .poll(() => page.evaluate((sel) => document.querySelector(sel).scrollLeft, viewport), { timeout: 3000 })
    .toBeLessThan(max - 100);

  // Y al volver a desktop el loop también sigue vivo.
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator(cards)).toHaveCount(10);
  const max2 = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    el.scrollLeft = el.scrollWidth;
    return el.scrollLeft;
  }, viewport);
  await expect
    .poll(() => page.evaluate((sel) => document.querySelector(sel).scrollLeft, viewport), { timeout: 3000 })
    .toBeLessThan(max2 - 100);
});

test("Carrusel de Inicio: con una sola experiencia no duplica, no hace autoplay y oculta flechas/contador", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/index.html");
  await expect(page.locator(cards)).toHaveCount(10);

  // Filtro Travesías: el mock tiene 1 sola con foto.
  await page.locator("#exp-home-filtros .filtro-btn", { hasText: "Travesías" }).click();
  await expect(page.locator(cards)).toHaveCount(1);
  await expect(page.locator(nav)).toBeHidden();
  await expect(page.locator(counter)).toHaveText("");

  // Sin autoplay: el riel no se mueve.
  await page.waitForTimeout(800);
  expect(await page.evaluate((sel) => document.querySelector(sel).scrollLeft, viewport)).toBe(0);

  // Lo mismo si se redimensiona estando en ese estado (no se duplica).
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(cards)).toHaveCount(1);
  await expect(page.locator(nav)).toBeHidden();

  // Volver a "Todos" reactiva el loop completo.
  await page.locator("#exp-home-filtros .filtro-btn", { hasText: "Todos" }).click();
  await expect(page.locator(cards)).toHaveCount(10);
  await expect(page.locator(nav)).toBeVisible();
  await expect(page.locator(counter)).toHaveText("01 / 05");
});

test("Carrusel de Inicio: las flechas avanzan y retroceden una tarjeta dentro del loop", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/index.html");
  await expect(page.locator(cards)).toHaveCount(10);

  await page.locator("#exp-home-next").click();
  await expect(page.locator(counter)).toHaveText("02 / 05");
  await page.locator("#exp-home-prev").click();
  await expect(page.locator(counter)).toHaveText("01 / 05");
});
