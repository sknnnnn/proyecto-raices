const { test, expect } = require("./support/fixtures");

/*
 * Test 4 — Tours / Travesías / Paquetes: las entradas actuales llevan a
 * contenido válido y el filtro por destino de esas páginas funciona.
 */

test("Tours: entrada válida y el filtro por destino funciona", async ({ page }) => {
  await page.goto("/index.html");
  await page.locator('footer a[href="tours.html"]').click();
  await expect(page).toHaveURL(/tours\.html/);

  const grid = page.locator("#prop-grid .exp-card");
  // Sin filtro: las 3 experiencias tipo "tour" del mock (Cusco x2 + Bariloche).
  await expect(grid).toHaveCount(3);

  const select = page.locator("#prop-destino-select");
  await expect(select).toBeVisible();
  await select.selectOption({ label: "Bariloche" });

  await expect(grid).toHaveCount(1);
  await expect(grid.first()).toContainText("Cerro Campanario");
});

test("Travesías: entrada válida, sólo travesías", async ({ page }) => {
  await page.goto("/index.html");
  await page.locator('footer a[href="travesias.html"]').click();
  await expect(page).toHaveURL(/travesias\.html/);

  const grid = page.locator("#prop-grid .exp-card");
  await expect(grid).toHaveCount(1);
  await expect(grid.first()).toContainText("Salkantay Trek");
});

test("Paquetes: entrada válida, sólo paquetes", async ({ page }) => {
  await page.goto("/index.html");
  await page.locator('footer a[href="paquetes.html"]').click();
  await expect(page).toHaveURL(/paquetes\.html/);

  const grid = page.locator("#prop-grid .exp-card");
  await expect(grid).toHaveCount(1);
  await expect(grid.first()).toContainText("Ruta andina integral");
});
