/**
 * BACKEND UNIT TESTS - JWT utilities
 *
 * Purpose: validate token generation/verification in isolation so auth routes
 * rely on proven primitives.
 *
 * Why needed:
 * - Confirms JWTs encode payloads and maintain integrity.
 * - Ensures tampering or malformed strings throw, preventing false-positive
 *   authentication.
 *
 * Scope: pure Node.js calls; no HTTP, DB, or browser.
 */
import { test, expect } from '@playwright/test'
import { generateAccessToken, verifyAccessToken } from '../../server/src/utils/jwt.js'

test.describe('generateAccessToken', () => {
  test('returns a string with three dot-separated segments (JWT format)', () => {
    // Act: sign a simple payload
    const token = generateAccessToken({ user_id: 1, email: 'test@example.com' })
    // Assert: shape matches JWT structure
    expect(typeof token).toBe('string')
    const parts = token.split('.')
    expect(parts).toHaveLength(3)
  })

  test('includes the payload claims in the token', () => {
    // Arrange: payload with known values
    const payload = { user_id: 42, email: 'alice@example.com' }
    // Act: sign and decode
    const token = generateAccessToken(payload)
    const decoded = verifyAccessToken(token)
    // Assert: claims survive round-trip
    expect(decoded.user_id).toBe(42)
    expect(decoded.email).toBe('alice@example.com')
  })

  test('different payloads produce different tokens', () => {
    // Act: sign two distinct payloads
    const t1 = generateAccessToken({ user_id: 1, email: 'a@a.com' })
    const t2 = generateAccessToken({ user_id: 2, email: 'b@b.com' })
    // Assert: signatures differ
    expect(t1).not.toBe(t2)
  })
})

test.describe('verifyAccessToken', () => {
  test('returns the decoded payload for a valid token', () => {
    // Arrange: sign then verify
    const token = generateAccessToken({ user_id: 7, email: 'user@example.com' })
    const decoded = verifyAccessToken(token)
    expect(decoded.user_id).toBe(7)
    expect(decoded.email).toBe('user@example.com')
  })

  test('throws for a completely invalid token string', () => {
    // Act + Assert: malformed token should throw
    expect(() => verifyAccessToken('not.a.token')).toThrow()
  })

  test('throws for a tampered token', () => {
    // Arrange: valid token then corrupt signature
    const token = generateAccessToken({ user_id: 1, email: 'x@x.com' })
    // Flip the last character to corrupt the signature
    const tampered = token.slice(0, -1) + (token.endsWith('A') ? 'B' : 'A')
    // Assert: verification rejects tampering
    expect(() => verifyAccessToken(tampered)).toThrow()
  })
})
