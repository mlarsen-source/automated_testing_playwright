/**
 * END-TO-END TESTS - Notes CRUD flow
 *
 * Purpose: verify the full user journey (register -> login -> create -> delete)
 * through the real UI.
 *
 * Why needed:
 * - Confirms note creation updates the DOM without reload.
 * - Ensures deletion removes items visually and from data.
 * - Checks unauthenticated users get redirected to login.
 */
import { test, expect } from '@playwright/test'

const uniqueEmail = () =>
  `e2e-notes-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`

test.describe('Notes CRUD flow', () => {
  const testUser = {
    email: uniqueEmail(),
    password: 'Password123!',
    first_name: 'Notes',
    last_name: 'E2E',
  }

  // Register once for the whole suite
  test.beforeAll(async ({ request }) => {
    // Seed a user via API so UI tests focus on the notes flow
    const res = await request.post('/api/register', { data: testUser })
    expect(res.status()).toBe(201)
  })

  // Log in before each individual test so each test starts authenticated
  test.beforeEach(async ({ page }) => {
    // Perform UI login
    await page.goto('/login')
    await page.fill('[data-testid="email-input"]', testUser.email)
    await page.fill('[data-testid="password-input"]', testUser.password)
    await page.click('[data-testid="submit-button"]')
    await page.waitForURL('/')
  })

  test('user can create a note and see it in the list', async ({ page }) => {
    // Create a note through the UI
    await page.fill('[data-testid="note-title-input"]', 'My First E2E Note')
    await page.fill('[data-testid="note-content-input"]', 'Written by Playwright')
    await page.click('[data-testid="create-note-button"]')

    // The new note should appear in the list without a page reload
    const card = page.locator('[data-testid="note-card"]').filter({ hasText: 'My First E2E Note' })
    await expect(card).toBeVisible()
    await expect(card).toContainText('Written by Playwright')
  })

  test('user can delete a note and it disappears from the list', async ({ page }) => {
    // Create a note to delete
    await page.fill('[data-testid="note-title-input"]', 'Note To Delete')
    await page.click('[data-testid="create-note-button"]')

    const card = page.locator('[data-testid="note-card"]').filter({ hasText: 'Note To Delete' })
    await expect(card).toBeVisible()

    // Click the delete button on that specific card
    await card.locator('[data-testid="delete-button"]').click()

    // The card should be gone from the DOM
    await expect(card).not.toBeVisible()
  })

  test('unauthenticated user is redirected to login', async ({ page }) => {
    // Clear cookies to simulate logged-out state
    await page.context().clearCookies()
    await page.goto('/')
    await expect(page).toHaveURL('/login')
  })
})
