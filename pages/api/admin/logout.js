export default function handler(req, res) {
  if (req.method === 'POST') {
    console.log('[API] Admin logout requested')
    res.setHeader('Set-Cookie', 'admin_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict')
    res.status(200).json({ success: true, message: 'Logged out successfully' })
  } else {
    res.status(405).end()
  }
}
