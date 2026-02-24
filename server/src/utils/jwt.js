import jwt from 'jsonwebtoken'

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev-access-secret'

export function generateAccessToken(payload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '1h' })
}

export function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET)
}
