import { supabase } from '../../../lib/supabase'
import { isAdmin } from '../../../lib/auth'

export default async function handler(req, res) {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' })
  const { id } = req.query
  if (req.method === 'DELETE') {
    const { error } = await supabase.from('certificates').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }
  if (req.method === 'PUT') {
    const { name, issuer, date, url, status } = req.body
    const { data, error } = await supabase.from('certificates').update({ name, issuer, date, url, status }).eq('id', id).select()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data[0])
  }
  res.status(405).end()
}
