import jwt from 'jsonwebtoken'

export function verifyToken(req) {
  try {
    const cookieHeader = req.headers.cookie || ''
    const match = cookieHeader.match(/admin_token=([^;]+)/)
    if (!match) return null
    return jwt.verify(match[1], process.env.JWT_SECRET)
  } catch {
    return null
  }
}

export function isAdmin(req) {
  const decoded = verifyToken(req)
  return !!(decoded && decoded.role === 'admin')
}
