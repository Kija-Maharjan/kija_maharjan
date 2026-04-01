import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { name, email, subject, message } = req.body
  if (!name || !email || !message) return res.status(400).json({ error: 'Missing fields' })

  const { error } = await supabase.from('messages').insert([{ name, email, subject, message }])
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ success: true })
}
