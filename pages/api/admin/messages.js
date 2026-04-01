import { supabase } from '../../../lib/supabase'
import { isAdmin } from '../../../lib/auth'

export default async function handler(req, res) {
  if (!isAdmin(req)) return res.status(401).json({ message: 'Unauthorized' })
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }
  if (req.method === 'DELETE') {
    const { id } = req.body
    const { error } = await supabase.from('messages').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ message: 'Deleted' })
  }
  res.status(405).end()
}
