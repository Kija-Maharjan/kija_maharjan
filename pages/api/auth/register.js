import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { supabase } from '../../../lib/supabase'
import { rateLimit } from '../../../lib/rate-limit'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'
  const { allowed, remaining } = rateLimit(ip, { max: 5, windowMs: 60000 })
  if (!allowed) {
    return res.status(429).json({ error: 'Too many registration attempts. Try again later.' })
  }

  const { username, email, password } = req.body

  if (!username || !password || username.length < 3) {
    return res.status(400).json({ error: 'Username (min 3 chars) and password required.' })
  }

  const { data: existing } = await supabase
    .from('visitors')
    .select('id')
    .or(`username.eq.${username},email.eq.${email || ''}`)
    .maybeSingle()

  if (existing) {
    return res.status(409).json({ error: 'Username or email already taken.' })
  }

  const password_hash = await bcrypt.hash(password, 10)

  const { data, error } = await supabase
    .from('visitors')
    .insert([{ username, email: email || null, password_hash }])
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })

  const token = jwt.sign(
    { id: data.id, username: data.username, email: data.email, role: 'visitor' },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  )

  const isProduction = process.env.NODE_ENV === 'production'
  res.setHeader('Set-Cookie', `visitor_token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Strict${isProduction ? '; Secure' : ''}`)

  return res.status(201).json({ success: true, user: { id: data.id, username: data.username, email: data.email } })
}
