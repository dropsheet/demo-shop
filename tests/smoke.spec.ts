import { expect, test } from "@playwright/test";

test("home page renders the storefront and the discounted products", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  await page.goto("./");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("slow");
  await expect(page.getByTestId("product-card")).toHaveCount(6);

  // The two discounted products the demo work order puts a Sale badge on. Substring checks on purpose: they keep
  // passing once a badge and a struck-through original price are added to these cards.
  for (const [id, name, price] of [
    ["ceramic-mug", "Speckled Stoneware Mug", "$24.00"],
    ["wool-blanket", "Merino Herringbone Blanket", "$148.00"],
  ]) {
    const card = page.locator(`[data-product="${id}"]`);
    await card.scrollIntoViewIfNeeded();
    await expect(card.getByRole("heading", { name })).toBeVisible();
    // Substring, not exact: a struck-through original price may be added inside the same element
    await expect(card.getByText(price).first()).toBeVisible();
  }

  // The cart counts up
  await expect(page.getByLabel("0 items in cart")).toBeVisible();
  await page.locator('[data-product="ceramic-mug"]').getByRole("button", { name: "Add to cart" }).click();
  await expect(page.getByLabel("1 items in cart")).toBeVisible();
  await page.locator('[data-product="wool-blanket"]').getByRole("button", { name: "Add to cart" }).click();
  await expect(page.getByLabel("2 items in cart")).toBeVisible();
  await expect(page.locator('[data-product="ceramic-mug"]').getByRole("button", { name: "Added" })).toBeVisible();

  expect(errors).toEqual([]);
});
