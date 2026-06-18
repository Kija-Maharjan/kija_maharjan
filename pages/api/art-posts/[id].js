import { supabase } from '../../../lib/supabase'
import { isAdmin } from '../../../lib/auth'

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'DELETE') {
    if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' })
    const { error } = await supabase.from('art_posts').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }

  res.status(405).end()
}
