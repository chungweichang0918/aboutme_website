import { defineConfig } from '@playwright/test';

const baseURL = process.env.TEST_BASE_URL || 'http://127.0.0.1:4321';
export default defineConfig({
  testDir:'tests', testMatch:'**/*.spec.ts', workers:2,
  use: { baseURL, channel: process.env.TEST_CHROME === '1' ? 'chrome' : undefined },
  webServer: process.env.TEST_BASE_URL ? undefined : {
    command:'npm run preview -- --host 127.0.0.1 --port 4321',
    url:baseURL,
    env:{ ASTRO_TELEMETRY_DISABLED:'1' },
    reuseExistingServer:!process.env.CI,
    timeout:60000,
  },
});
