import { expect, test } from "@playwright/test";

// Previews are served under /demo-shop/<slug> (see next.config.ts). This spec runs in both CI builds: at the root,
// and under a base path. Every asset, link and client navigation must stay under the base path the page lives at.
const basePath = (process.env.BASE_PATH ?? "").replace(/\/+$/, "");

test("assets, links and client navigation stay under the base path", async ({ page }) => {
  const failed: string[] = [];
  page.on("response", (r) => r.status() >= 400 && failed.push(`${r.status()} ${r.url()}`));
  page.on("requestfailed", (r) => failed.push(`failed ${r.url()}`));

  await page.goto("./");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(new URL(page.url()).pathname.replace(/\/$/, "")).toBe(basePath);

  // The app's scripts, styles and fonts all load from <basePath>/_next/ (other origins, such as the Vercel toolbar that
  // Vercel injects into previews, are not the app's)
  const assets = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLScriptElement | HTMLLinkElement>("script[src], link[href]")]
      .map((e) => new URL("src" in e && e.src ? e.src : (e as HTMLLinkElement).href))
      .filter((u) => u.origin === location.origin)
      .map((u) => u.pathname),
  );
  expect(assets.length).toBeGreaterThan(0);
  for (const path of assets) expect(path, path).toMatch(new RegExp(`^${basePath}/_next/`));

  // The brand link points at the base path, and following it is a client navigation (no full page load)
  const brand = page.getByRole("link", { name: "Fernwood Supply home" });
  expect(new URL(await brand.evaluate((a: HTMLAnchorElement) => a.href)).pathname.replace(/\/$/, "")).toBe(basePath);
  await page.evaluate(() => ((window as unknown as { __noReload: boolean }).__noReload = true));
  await page.locator('[data-product="ceramic-mug"]').getByRole("button", { name: "Add to cart" }).click();
  await brand.click();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(new URL(page.url()).pathname.replace(/\/$/, "")).toBe(basePath);
  expect(await page.evaluate(() => (window as unknown as { __noReload?: boolean }).__noReload)).toBe(true);
  await expect(page.getByLabel("1 items in cart")).toBeVisible();

  expect(failed).toEqual([]);
});
