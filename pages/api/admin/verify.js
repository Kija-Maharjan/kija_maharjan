import { isAdmin } from '../../../lib/auth'

export default function handler(req, res) {
  if (isAdmin(req)) return res.status(200).json({ authenticated: true })
  return res.status(401).json({ authenticated: false })
}
