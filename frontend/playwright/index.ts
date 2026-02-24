import { beforeMount, afterMount } from '@playwright/experimental-ct-react/hooks'

/**
 * Global setup for component tests.
 * Use beforeMount to wrap every component in a provider (e.g. React Router, Redux).
 * This example has no global providers, but the file must exist.
 */
beforeMount(async ({ App }) => {
  // Example: return <ThemeProvider><App /></ThemeProvider>
  // For this demo, mount components as-is.
})

afterMount(async () => {
  // Cleanup after each component test (e.g. clear mocks, reset stores)
})
