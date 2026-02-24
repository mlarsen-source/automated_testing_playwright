/**
 * COMPONENT TESTS - LoginForm
 *
 * Purpose: ensure the login form renders fields/buttons and wires submit
 * events correctly without a backend.
 *
 * Why needed:
 * - Guards against UI regressions in form controls.
 * - Verifies submit passes user input to the callback.
 * - Ensures error messaging renders only when provided.
 *
 * Runner: Playwright component testing (isolated Vite mount).
 */
import { test, expect } from '@playwright/experimental-ct-react'
import LoginForm from '../components/LoginForm'

test('renders email and password inputs', async ({ mount }) => {
  // Mount the form
  const component = await mount(<LoginForm onSubmit={() => {}} />)

  // Assert: essential inputs present
  await expect(component.getByTestId('email-input')).toBeVisible()
  await expect(component.getByTestId('password-input')).toBeVisible()
})

test('renders a submit button', async ({ mount }) => {
  // Mount the form
  const component = await mount(<LoginForm onSubmit={() => {}} />)

  // Assert: submit button visible and labeled
  await expect(component.getByTestId('submit-button')).toBeVisible()
  await expect(component.getByTestId('submit-button')).toContainText('Login')
})

test('calls onSubmit with the entered email and password', async ({ mount }) => {
  let submittedEmail = ''
  let submittedPassword = ''

  // Mount with capturing callback
  const component = await mount(
    <LoginForm
      onSubmit={(email, password) => {
        submittedEmail = email
        submittedPassword = password
      }}
    />
  )

  // Act: fill and submit
  await component.getByTestId('email-input').fill('test@example.com')
  await component.getByTestId('password-input').fill('mypassword')
  await component.getByTestId('submit-button').click()

  // Assert: callback received values
  expect(submittedEmail).toBe('test@example.com')
  expect(submittedPassword).toBe('mypassword')
})

test('displays an error message when the error prop is provided', async ({ mount }) => {
  // Mount with error prop
  const component = await mount(<LoginForm onSubmit={() => {}} error="Invalid credentials" />)

  // Assert: error shown
  await expect(component.getByTestId('error-message')).toBeVisible()
  await expect(component.getByTestId('error-message')).toContainText('Invalid credentials')
})

test('does not show an error message when error prop is absent', async ({ mount }) => {
  // Mount without error prop
  const component = await mount(<LoginForm onSubmit={() => {}} />)

  // Assert: no error rendered
  await expect(component.getByTestId('error-message')).not.toBeVisible()
})
