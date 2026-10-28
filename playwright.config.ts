/**
 * Playwright end-to-end configuration.
 *
 * Tests run against `vite preview`, which serves the real production build including the
 * prerendered HTML, so they check what visitors actually receive. Run `npm run build` first.
 * Desktop Chrome is the primary target (the site is designed desktop first); mobile viewports
 * are added when the responsive layout lands in U2.
 */
import { defineConfig, devices } from '@playwright/test';

const isCi = Boolean(process.env.CI);

export default defineConfig({
  testDir: 'tests/e2e',
  forbidOnly: isCi,
  retries: isCi ? 1 : 0,
  reporter: isCi ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4173',
  },
  projects: [{ name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !isCi,
  },
});
