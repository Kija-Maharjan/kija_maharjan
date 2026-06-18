import { verifyVisitorToken } from '../../../lib/visitor-auth'

export default function handler(req, res) {
  const decoded = verifyVisitorToken(req)
  if (!decoded) {
    return res.status(401).json({ authenticated: false })
  }

  return res.status(200).json({
    authenticated: true,
    user: { id: decoded.id, username: decoded.username, email: decoded.email },
  })
}
