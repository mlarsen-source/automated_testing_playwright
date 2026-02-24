import { verifyAccessToken } from '../utils/jwt.js'

export function authenticate(req, res, next) {
  const token =
    req.cookies?.access_token ||
    req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    req.user = verifyAccessToken(token)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}
