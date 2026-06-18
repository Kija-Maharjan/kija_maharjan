import jwt from 'jsonwebtoken'

export function verifyVisitorToken(req) {
  try {
    const cookieHeader = req.headers.cookie || ''
    const match = cookieHeader.match(/visitor_token=([^;]+)/)
    if (!match) return null
    return jwt.verify(match[1], process.env.JWT_SECRET)
  } catch {
    return null
  }
}

export function getVisitor(req) {
  const decoded = verifyVisitorToken(req)
  if (decoded && decoded.role === 'visitor') {
    return { id: decoded.id, username: decoded.username, email: decoded.email }
  }
  return null
}
