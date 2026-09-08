const { test, expect } = require("./support/fixtures");

/*
 * Test 1 — Navegación principal.
 * Desde Home se puede llegar a cada sección del nav superior.
 */
test.describe("Navegación principal", () => {
  const destinos = [
    { nav: "experiencias", url: /experiencias\.html/, heading: "Experiencias" },
    { nav: "destinos", url: /destinos\.html/, heading: "Destinos" },
    { nav: "nosotros", url: /nosotros\.html/ },
    { nav: "galeria", url: /galeria\.html/ },
    { nav: "contacto", url: /contacto\.html/ },
  ];

  for (const d of destinos) {
    test(`Home → ${d.nav}`, async ({ page }) => {
      await page.goto("/index.html");
      await page.locator(`nav a[data-nav="${d.nav}"]`).first().click();
      await expect(page).toHaveURL(d.url);
      // La página destino carga su propio nav (misma estructura en todo el sitio).
      await expect(page.locator("header nav .brand")).toBeVisible();
    });
  }
});
