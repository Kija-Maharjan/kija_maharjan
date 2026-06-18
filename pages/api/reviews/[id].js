import { supabase } from '../../../lib/supabase'
import { isAdmin } from '../../../lib/auth'

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'PATCH') {
    if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' })
    const { status } = req.body
    const { data, error } = await supabase.from('reviews').update({ status }).eq('id', id).select()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data[0])
  }

  if (req.method === 'DELETE') {
    if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' })
    const { error } = await supabase.from('reviews').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }

  res.status(405).end()
}
