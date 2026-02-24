/**
 * INTEGRATION TESTS - Authentication API
 *
 * Purpose: exercise the real HTTP pipeline (routing, validation, hashing, DB)
 * for auth flows, without a browser.
 *
 * Why needed:
 * - Proves registration stores unique users and blocks duplicates.
 * - Verifies login returns 200 + body for valid creds and 401 otherwise.
 * - Catches schema/validation regressions that unit tests would miss.
 *
 * Runner: Playwright request context against the running server + database.
 */
import { test, expect, request } from '@playwright/test'

// Each test run gets unique emails so tests don't collide across runs
const uniqueEmail = () => `auth-test-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`

const baseURL = process.env.API_URL || 'http://localhost:3001'

const baseUser = () => ({
  email: uniqueEmail(),
  password: 'Password123!',
  first_name: 'Test',
  last_name: 'User',
})

test.describe('POST /api/register', () => {
  test('creates a new user and returns 201 with user data', async () => {
    // Arrange: new isolated request context and unique user
    const ctx = await request.newContext({ baseURL })
    const user = baseUser()

    // Act: register
    const res = await ctx.post('/api/register', { data: user })

    // Assert: created + sanitized response
    expect(res.status()).toBe(201)
    const body = await res.json()
    expect(body.email).toBe(user.email)
    expect(body.user_id).toBeDefined()
    // Password must never be returned
    expect(body).not.toHaveProperty('password')
    expect(body).not.toHaveProperty('password_hash')
  })

  test('returns 409 when the email is already registered', async () => {
    // Arrange: register once, then duplicate
    const ctx = await request.newContext({ baseURL })
    const user = baseUser()

    await ctx.post('/api/register', { data: user })
    const res = await ctx.post('/api/register', { data: user })

    // Assert: conflict
    expect(res.status()).toBe(409)
  })

  test('returns 400 when required fields are missing', async () => {
    // Arrange: missing first/last name
    const ctx = await request.newContext({ baseURL })

    const res = await ctx.post('/api/register', {
      data: { email: uniqueEmail(), password: 'secret' }, // missing first_name, last_name
    })

    // Assert: bad request
    expect(res.status()).toBe(400)
  })
})

test.describe('POST /api/login', () => {
  test('returns 200 and sets a cookie for valid credentials', async () => {
    // Arrange: create user then login
    const ctx = await request.newContext({ baseURL })
    const user = baseUser()

    await ctx.post('/api/register', { data: user })
    const res = await ctx.post('/api/login', {
      data: { email: user.email, password: user.password },
    })

    // Assert: OK and user data
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.email).toBe(user.email)
  })

  test('returns 401 for a wrong password', async () => {
    // Arrange: valid user, wrong password
    const ctx = await request.newContext({ baseURL })
    const user = baseUser()

    await ctx.post('/api/register', { data: user })
    const res = await ctx.post('/api/login', {
      data: { email: user.email, password: 'wrong-password' },
    })

    // Assert: unauthorized
    expect(res.status()).toBe(401)
  })

  test('returns 401 for an email that does not exist', async () => {
    // Act: login without prior registration
    const ctx = await request.newContext({ baseURL })

    const res = await ctx.post('/api/login', {
      data: { email: 'nobody@nowhere.com', password: 'whatever' },
    })

    // Assert: unauthorized
    expect(res.status()).toBe(401)
  })
})
