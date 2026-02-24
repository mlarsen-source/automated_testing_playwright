/**
 * END-TO-END TESTS - Login flow
 *
 * Purpose: prove the user-visible login experience works across the full stack
 * (browser, Next.js, API, DB).
 *
 * Why needed:
 * - Confirms routing + redirects after successful login.
 * - Shows errors surface in the UI for bad creds.
 * - Guards against regressions in form wiring or auth cookies.
 */
import { test, expect } from '@playwright/test'

const uniqueEmail = () =>
  `e2e-login-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`

test.describe('Login flow', () => {
  const testUser = {
    email: uniqueEmail(),
    password: 'Password123!',
    first_name: 'E2E',
    last_name: 'Tester',
  }

  // Register the user via the API so we don't depend on the register page
  test.beforeAll(async ({ request }) => {
    // Arrange: seed user directly through API
    const res = await request.post('/api/register', { data: testUser })
    expect(res.status()).toBe(201)
  })

  test('user can log in and is redirected to the notes page', async ({ page }) => {
    // Navigate to login and submit valid credentials
    await page.goto('/login')

    await page.fill('[data-testid="email-input"]', testUser.email)
    await page.fill('[data-testid="password-input"]', testUser.password)
    await page.click('[data-testid="submit-button"]')

    // After login the app redirects to / and shows "My Notes"
    await expect(page).toHaveURL('/')
    await expect(page.locator('h1')).toContainText('My Notes')
  })

  test('shows an error message for wrong password', async ({ page }) => {
    // Attempt login with wrong password
    await page.goto('/login')

    await page.fill('[data-testid="email-input"]', testUser.email)
    await page.fill('[data-testid="password-input"]', 'wrong-password')
    await page.click('[data-testid="submit-button"]')

    // Stay on login page, show error
    await expect(page).toHaveURL('/login')
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible()
  })

  test('shows an error message for an email that does not exist', async ({ page }) => {
    // Attempt login with unknown email
    await page.goto('/login')

    await page.fill('[data-testid="email-input"]', 'nobody@nowhere.com')
    await page.fill('[data-testid="password-input"]', 'anything')
    await page.click('[data-testid="submit-button"]')

    await expect(page.locator('[data-testid="error-message"]')).toBeVisible()
  })
})
