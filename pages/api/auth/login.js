import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { supabase } from '../../../lib/supabase'
import { rateLimit } from '../../../lib/rate-limit'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'
  const { allowed, remaining } = rateLimit(ip, { max: 5, windowMs: 60000 })
  if (!allowed) {
    return res.status(429).json({ error: 'Too many login attempts. Try again later.' })
  }

  const { username, password } = req.body

  const { data: visitor, error } = await supabase
    .from('visitors')
    .select('*')
    .eq('username', username)
    .maybeSingle()

  if (error || !visitor) {
    return res.status(401).json({ error: 'Invalid username or password.' })
  }

  const valid = await bcrypt.compare(password, visitor.password_hash)
  if (!valid) {
    return res.status(401).json({ error: 'Invalid username or password.' })
  }

  const token = jwt.sign(
    { id: visitor.id, username: visitor.username, email: visitor.email, role: 'visitor' },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  )

  const isProduction = process.env.NODE_ENV === 'production'
  res.setHeader('Set-Cookie', `visitor_token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Strict${isProduction ? '; Secure' : ''}`)

  return res.status(200).json({ success: true, user: { id: visitor.id, username: visitor.username, email: visitor.email } })
}
