import { defineConfig } from "@playwright/test";

const port = Number(process.env.PORT ?? 3000);

export default defineConfig({
  testDir: "tests",
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: { baseURL: process.env.BASE_URL ?? `http://localhost:${port}` },
  projects: [
    { name: "light", use: { browserName: "chromium", colorScheme: "light" } },
    { name: "dark", use: { browserName: "chromium", colorScheme: "dark" } },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : { command: `npm start -- -p ${port}`, port, reuseExistingServer: false, timeout: 60_000 },
});
