/**
 * BACKEND UNIT TESTS - hash utilities
 *
 * Purpose: prove our password hashing helpers behave correctly in isolation
 * without touching HTTP or the database.
 *
 * Why needed:
 * - Guarantees bcrypt config (salt rounds) produces valid hashes.
 * - Ensures verifyPassword correctly distinguishes matching/mismatching inputs,
 *   protecting authentication logic from silent failures.
 *
 * Runner: Playwright test (no browser); imports the pure functions directly.
 */
import { test, expect } from '@playwright/test'
import { hashPassword, verifyPassword } from '../../server/src/utils/hash.js'

test.describe('hashPassword', () => {
  test('returns a bcrypt hash string', async () => {
    // Act: hash a sample password
    const hash = await hashPassword('secret123')
    // Assert: result shape matches bcrypt format
    expect(typeof hash).toBe('string')
    // bcrypt hashes always start with $2b$ (or $2a$ on older versions)
    expect(hash).toMatch(/^\$2[ab]\$/)
  })

  test('produces a different hash each time for the same password', async () => {
    // Act: hash identical input twice (bcrypt salts internally)
    const hash1 = await hashPassword('secret123')
    const hash2 = await hashPassword('secret123')
    // bcrypt uses a random salt so hashes differ even for the same input
    expect(hash1).not.toBe(hash2)
  })

  test('produces a hash of expected length (60 characters)', async () => {
    // Act: hash and check canonical bcrypt length
    const hash = await hashPassword('secret123')
    expect(hash.length).toBe(60)
  })
})

test.describe('verifyPassword', () => {
  test('returns true when password matches the hash', async () => {
    // Arrange: create a known-good hash
    const hash = await hashPassword('correct-password')
    // Act + Assert: verify succeeds
    const result = await verifyPassword('correct-password', hash)
    expect(result).toBe(true)
  })

  test('returns false when password does not match', async () => {
    // Arrange: hash a password then check with wrong input
    const hash = await hashPassword('correct-password')
    const result = await verifyPassword('wrong-password', hash)
    expect(result).toBe(false)
  })

  test('returns false for empty string against a real hash', async () => {
    // Arrange: hash a non-empty secret
    const hash = await hashPassword('secret')
    // Act + Assert: empty password should fail verification
    const result = await verifyPassword('', hash)
    expect(result).toBe(false)
  })
})
