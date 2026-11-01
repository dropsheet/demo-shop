import { defineConfig } from "@playwright/test";

const port = Number(process.env.PORT ?? 3000);
// BASE_PATH: the base path the app was built with (NEXT_BASE_PATH), so the smoke runs under it
const basePath = (process.env.BASE_PATH ?? "").replace(/\/+$/, "");

export default defineConfig({
  testDir: "tests",
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  // Trailing slash so the specs' relative "./" resolves inside the base path
  use: { baseURL: (process.env.BASE_URL ?? `http://localhost:${port}${basePath}`).replace(/\/*$/, "/") },
  projects: [
    { name: "light-desktop", use: { browserName: "chromium", colorScheme: "light", viewport: { width: 1440, height: 900 } } },
    { name: "light-phone", use: { browserName: "chromium", colorScheme: "light", viewport: { width: 390, height: 844 } } },
    { name: "dark-desktop", use: { browserName: "chromium", colorScheme: "dark", viewport: { width: 1440, height: 900 } } },
    { name: "dark-phone", use: { browserName: "chromium", colorScheme: "dark", viewport: { width: 390, height: 844 } } },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: `npm start -- -p ${port}`,
        port,
        reuseExistingServer: false,
        timeout: 60_000,
        // next start reads next.config.ts again, so it needs the base path the build used
        env: { ...(process.env as Record<string, string>), ...(basePath ? { NEXT_BASE_PATH: basePath } : {}) },
      },
});
