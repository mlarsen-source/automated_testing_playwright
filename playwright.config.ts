import { defineConfig, devices } from '@playwright/test'

/**
 * Root Playwright config - covers three of the four test types:
 *
 *   unit        -> tests/unit/        - No browser. Pure Node.js function tests.
 *   integration -> tests/integration/ - No browser. Real HTTP via request context.
 *   e2e         -> tests/e2e/         - Real Chromium browser. Full user flows.
 *
 * Component tests live in frontend/ and use a separate config:
 *   frontend/playwright-ct.config.ts
 *
 * Run all three: npx playwright test
 * Run one type:  npx playwright test --project=unit
 */
export default defineConfig({
  // Run each project's tests serially so integration tests do not race for the DB
  fullyParallel: false,
  workers: 1,

  // Fail fast in CI; retry once on flakiness
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,

  reporter: [['html', { open: 'never' }], ['list']],

  projects: [
    // -- UNIT ----------------------------------------------------------------
    // No browser. Playwright is used only as the test runner.
    // Imports server utility functions directly via Node.js ESM.
    {
      name: 'unit',
      testDir: './tests/unit',
    },

    // -- INTEGRATION ---------------------------------------------------------
    // No browser. Uses Playwright's request context (like a headless HTTP client).
    // baseURL points directly at the Express server.
    {
      name: 'integration',
      testDir: './tests/integration',
      use: {
        baseURL: process.env.API_URL || 'http://localhost:3001',
        extraHTTPHeaders: { Accept: 'application/json' },
      },
    },

    // -- END-TO-END ----------------------------------------------------------
    // Real Chromium browser. baseURL points at the Next.js frontend.
    // API calls in the browser go through Next.js rewrites -> server.
    {
      name: 'e2e',
      testDir: './tests/e2e',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.FRONTEND_URL || 'http://localhost:3000',
      },
    },
  ],
})
