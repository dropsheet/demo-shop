import { expect, test } from "@playwright/test";

test("home page renders the storefront and the discounted products", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("slow");
  await expect(page.getByTestId("product-card")).toHaveCount(6);

  // The two discounted products the demo work order puts a Sale badge on
  const mug = page.locator('[data-product="ceramic-mug"]');
  await expect(mug).toContainText("Speckled Stoneware Mug");
  await expect(mug).toContainText("$24.00");
  const blanket = page.locator('[data-product="wool-blanket"]');
  await expect(blanket).toContainText("Merino Herringbone Blanket");
  await expect(blanket).toContainText("$148.00");

  // The cart works
  await mug.getByRole("button", { name: /add to cart/i }).click();
  await expect(page.getByLabel("1 items in cart")).toBeVisible();

  expect(errors).toEqual([]);
});
