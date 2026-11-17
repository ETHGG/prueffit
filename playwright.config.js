import { defineConfig, devices } from 'playwright/test';

// Browser tests (npm run test:e2e). Serves the app with a static server, exactly as
// on GitHub Pages: no build step, relative paths.
export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://127.0.0.1:8080/',
    // Since 2.0 the job is chosen once before anything else; tests start as a FISI user who already
    // confirmed the job. Tests of the job setup clear localStorage first (e2e/job.spec.js).
    storageState: {
      cookies: [],
      origins: [{
        origin: 'http://127.0.0.1:8080',
        localStorage: [{ name: 'prueffit.v1', value: JSON.stringify({ schemaVersion: 6, settings: { job: 'fisi', jobConfirmed: true } }) }],
      }],
    },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'python3 -m http.server 8080 --bind 127.0.0.1',
    url: 'http://127.0.0.1:8080/',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'iphone-se-chromium', use: { ...devices['iPhone SE'], browserName: 'chromium' } },
    { name: 'iphone-13-dark-chromium', use: { ...devices['iPhone 13'], browserName: 'chromium', colorScheme: 'dark' } },
    // Safari engine: closest to the real target device (runs in CI).
    { name: 'iphone-13-webkit', use: { ...devices['iPhone 13'] } },
  ],
});
