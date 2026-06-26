import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { rateLimit } from '../../../lib/rate-limit'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'
  const { allowed } = rateLimit(ip, { max: 5, windowMs: 60000 })
  if (!allowed) return res.status(429).json({ error: 'Too many login attempts. Try again later.' })

  const { username, password } = req.body
  const adminUser = process.env.ADMIN_USERNAME || 'kija'
  const adminHash = process.env.ADMIN_PASSWORD_HASH

  if (!adminHash) return res.status(500).json({ error: 'Server configuration error' })
  if (username !== adminUser) return res.status(401).json({ error: 'Invalid credentials' })

  const inputHash = crypto.createHash('sha256').update(password).digest('hex')
  if (inputHash !== adminHash) return res.status(401).json({ error: 'Invalid credentials' })

  const token = jwt.sign({ username, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' })

  const isProduction = process.env.NODE_ENV === 'production'
  res.setHeader('Set-Cookie', `admin_token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Strict${isProduction ? '; Secure' : ''}`)

  return res.status(200).json({ success: true })
}
