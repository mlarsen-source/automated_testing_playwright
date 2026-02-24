/**
 * INTEGRATION TESTS - Notes API
 *
 * Purpose: validate the authenticated notes lifecycle over real HTTP +
 * database, reusing a logged-in session.
 *
 * Why needed:
 * - Ensures auth is enforced (401 when unauthenticated).
 * - Confirms create returns persisted data and enforces required fields.
 * - Confirms delete removes rows and returns 404 for missing records.
 *
 * Runner: Playwright request context with cookies preserved across calls.
 */
import { test, expect, request, APIRequestContext } from '@playwright/test'

const uniqueEmail = () =>
  `notes-test-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`

const baseURL = process.env.API_URL || 'http://localhost:3001'

// Shared authenticated context - created once, reused across all tests in the suite
let authCtx: APIRequestContext

test.beforeAll(async () => {
  // Create one authenticated context for all tests
  authCtx = await request.newContext({ baseURL })

  const user = {
    email: uniqueEmail(),
    password: 'Password123!',
    first_name: 'Notes',
    last_name: 'Tester',
  }

  // Register and log in to seed session cookie
  await authCtx.post('/api/register', { data: user })
  const loginRes = await authCtx.post('/api/login', {
    data: { email: user.email, password: user.password },
  })
  // Verify login succeeded before running note tests
  expect(loginRes.status()).toBe(200)
})

test.afterAll(async () => {
  await authCtx.dispose()
})

test.describe('GET /api/notes', () => {
  test('returns 200 and an array for an authenticated user', async () => {
    // Act: fetch notes while authenticated
    const res = await authCtx.get('/api/notes')
    expect(res.status()).toBe(200)
    const notes = await res.json()
    // Assert: returns an array
    expect(Array.isArray(notes)).toBe(true)
  })

  test('returns 401 when called without authentication', async () => {
    // Act: use a fresh context with no cookies
    const unauthCtx = await request.newContext({ baseURL })
    const res = await unauthCtx.get('/api/notes')
    // Assert: unauthorized
    expect(res.status()).toBe(401)
    await unauthCtx.dispose()
  })
})

test.describe('POST /api/notes', () => {
  test('creates a note and returns 201 with note data', async () => {
    // Act: create a note
    const res = await authCtx.post('/api/notes', {
      data: { title: 'Integration Test Note', content: 'Created by Playwright' },
    })

    // Assert: created with required fields
    expect(res.status()).toBe(201)
    const note = await res.json()
    expect(note.title).toBe('Integration Test Note')
    expect(note.note_id).toBeDefined()
    expect(note.user_id).toBeDefined()
  })

  test('returns 400 when title is missing', async () => {
    // Act: send body without title
    const res = await authCtx.post('/api/notes', {
      data: { content: 'No title here' },
    })
    // Assert: validation fails
    expect(res.status()).toBe(400)
  })
})

test.describe('DELETE /api/notes/:id', () => {
  test('deletes an existing note and returns 200', async () => {
    // Arrange: create a note to delete
    const createRes = await authCtx.post('/api/notes', {
      data: { title: 'To Be Deleted' },
    })
    const { note_id } = await createRes.json()

    // Act: delete the note
    const deleteRes = await authCtx.delete(`/api/notes/${note_id}`)
    expect(deleteRes.status()).toBe(200)

    // Assert: note no longer returned
    const notes = await (await authCtx.get('/api/notes')).json()
    const found = notes.find((n: { note_id: number }) => n.note_id === note_id)
    expect(found).toBeUndefined()
  })

  test('returns 404 when the note does not exist', async () => {
    // Act + Assert: deleting unknown id should 404
    const res = await authCtx.delete('/api/notes/999999')
    expect(res.status()).toBe(404)
  })
})
