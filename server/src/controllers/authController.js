import { User } from '../models/index.js'
import { hashPassword, verifyPassword } from '../utils/hash.js'
import { generateAccessToken } from '../utils/jwt.js'

export async function register(req, res) {
  const { email, password, first_name, last_name } = req.body

  if (!email || !password || !first_name || !last_name) {
    return res.status(400).json({ error: 'All fields required' })
  }

  try {
    const existing = await User.findOne({ where: { email } })
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' })
    }

    const password_hash = await hashPassword(password)
    const user = await User.create({ email, password_hash, first_name, last_name })
    res.status(201).json({ user_id: user.user_id, email: user.email })
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
}

export async function login(req, res) {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' })
  }

  try {
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const valid = await verifyPassword(password, user.password_hash)
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = generateAccessToken({ user_id: user.user_id, email: user.email })
    res.cookie('access_token', token, { httpOnly: true, maxAge: 3_600_000 })
    res.json({ user_id: user.user_id, email: user.email })
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
}

export async function logout(req, res) {
  res.clearCookie('access_token')
  res.json({ message: 'Logged out' })
}
