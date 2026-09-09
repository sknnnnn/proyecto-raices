const { test, expect } = require("./support/fixtures");

/*
 * Test 2 — Flujo principal de Experiencias:
 *   Home → Experiencias → Cusco → catálogo → detalle → ← Volver
 *
 * Test 3 — Filtros del catálogo (mismo destino, sin repetir la
 * navegación completa: arranca directo en catalogo.html?destino=cusco).
 */

test("Home → Experiencias → Cusco → catálogo → detalle → breadcrumb y ← Volver", async ({ page }) => {
  await page.goto("/index.html");
  await page.locator('nav a[data-nav="experiencias"]').first().click();
  await expect(page).toHaveURL(/experiencias\.html/);

  // Explorador país → destino: "Perú" es el país por defecto (primero en
  // aparecer en los datos), así que el tile de Cusco ya está visible.
  const cuscoTile = page.locator(".exp-destino-tile", { hasText: "Cusco" });
  await expect(cuscoTile).toBeVisible();
  await cuscoTile.click();

  await expect(page).toHaveURL(/catalogo\.html\?destino=cusco&origen=experiencias/);
  await expect(page.locator("#cat-titulo")).toHaveText("Cusco");
  await expect(page.locator("#cat-breadcrumb")).toContainText("Destinos");
  await expect(page.locator("#cat-breadcrumb")).toContainText("Cusco");
  // "← Volver a Experiencias" (PRO-48): catalogo.html llegó con ?origen=experiencias.
  await expect(page.locator("#cat-volver")).toHaveText("← Volver a Experiencias");

  const cityTourCard = page.locator(".exp-card", { hasText: "City Tour" });
  await expect(cityTourCard).toBeVisible();
  await cityTourCard.locator("a.btn-sm", { hasText: "Ver detalles" }).click();

  await expect(page).toHaveURL(/propuesta\.html\?id=cusco-city-tour/);
  await expect(page.locator("#prop-detalle h1")).toHaveText("City Tour — Guía 2 idiomas");

  // Breadcrumb con el nivel "Experiencias" (PRO-47/48: viene del ?origen=
  // que ya traía el link de catalogo.html, no de document.referrer).
  await expect(page.locator("#exp-breadcrumb")).toHaveText(
    "Inicio / Experiencias / Cusco / City Tour — Guía 2 idiomas"
  );

  const volver = page.locator("#prop-volver");
  await expect(volver).toBeVisible();
  await expect(volver).toHaveText("← Volver a Cusco");
  await expect(volver).toHaveAttribute("href", "catalogo.html?destino=cusco&origen=experiencias");

  await volver.click();
  await expect(page).toHaveURL(/catalogo\.html\?destino=cusco&origen=experiencias/);
  await expect(page.locator("#cat-titulo")).toHaveText("Cusco");
});

test("Filtros del catálogo por destino cambian el resultado de forma coherente", async ({ page }) => {
  await page.goto("/catalogo.html?destino=cusco&origen=experiencias");

  const grid = page.locator("#prop-grid .exp-card");
  const filtros = page.locator("#prop-filtros .filtro-btn");

  // "Todos": las 4 experiencias del mock para Cusco (2 tours + 1 travesía + 1 paquete).
  await expect(grid).toHaveCount(4);
  await expect(filtros.filter({ hasText: "Todos" })).toHaveClass(/active/);

  await filtros.filter({ hasText: "Tours" }).click();
  await expect(grid).toHaveCount(2);
  await expect(filtros.filter({ hasText: "Tours" })).toHaveClass(/active/);
  await expect(grid.first()).toContainText(/City Tour|Skybike/);

  await filtros.filter({ hasText: "Travesías" }).click();
  await expect(grid).toHaveCount(1);
  await expect(grid.first()).toContainText("Salkantay Trek");

  await filtros.filter({ hasText: "Paquetes" }).click();
  await expect(grid).toHaveCount(1);
  await expect(grid.first()).toContainText("Ruta andina integral");
});

/*
 * Corrección puntual post-PRO-10: el resumen ya no se recorta con
 * line-clamp/overflow:hidden, y .actions centra el grupo de botones
 * (1 acción en el carrusel de Inicio, 2 en catalogo.html) en vez de
 * alinearlo a la izquierda.
 */
test("Descripción completa (sin recorte) y CTA centrado con 2 acciones", async ({ page }) => {
  await page.goto("/catalogo.html?destino=cusco&origen=experiencias");

  const cityTourCard = page.locator(".exp-card", { hasText: "City Tour" });
  const resumen = cityTourCard.locator(".resumen");
  await expect(resumen).toHaveText("Recorrido por Qoricancha y Sacsayhuamán.");
  // Sin overflow oculto: el texto completo entra en su propia caja.
  const clipped = await resumen.evaluate((el) => el.scrollHeight > el.clientHeight + 1);
  expect(clipped).toBe(false);

  const actions = cityTourCard.locator(".actions");
  await expect(actions.locator("a")).toHaveCount(2);
  const cardBox = await cityTourCard.boundingBox();
  const actionsBox = await actions.boundingBox();
  const leftGap = actionsBox.x - cardBox.x;
  const rightGap = (cardBox.x + cardBox.width) - (actionsBox.x + actionsBox.width);
  expect(Math.abs(leftGap - rightGap)).toBeLessThan(3);
});

test("CTA centrado con 1 sola acción (carrusel de Inicio)", async ({ page }) => {
  await page.goto("/index.html");

  const firstCard = page.locator("#exp-home-track .exp-card").first();
  await expect(firstCard).toBeVisible();
  const actions = firstCard.locator(".actions");
  await expect(actions.locator("a")).toHaveCount(1);

  const cardBox = await firstCard.boundingBox();
  const actionsBox = await actions.boundingBox();
  const leftGap = actionsBox.x - cardBox.x;
  const rightGap = (cardBox.x + cardBox.width) - (actionsBox.x + actionsBox.width);
  expect(Math.abs(leftGap - rightGap)).toBeLessThan(3);
});
