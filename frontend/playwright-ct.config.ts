import { defineConfig } from '@playwright/experimental-ct-react'
import react from '@vitejs/plugin-react'

/**
 * Component testing config.
 * Playwright spins up a Vite dev server on ctPort to mount components in isolation.
 * This does NOT require the Next.js app to be running.
 *
 * Run: npx playwright test -c playwright-ct.config.ts
 */
export default defineConfig({
  testDir: './tests',
  reporter: 'html',
  use: {
    // Port for the Vite-powered component test server
    ctPort: 3100,
    ctViteConfig: {
      plugins: [react()],
    },
  },
  projects: [
    {
      name: 'component-chromium',
      use: { browserName: 'chromium' },
    },
  ],
})
