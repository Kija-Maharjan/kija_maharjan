import { supabase } from '../../../lib/supabase'
import { isAdmin } from '../../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' })

  const { ids } = req.body
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'No IDs provided' })
  }

  const { error } = await supabase.from('projects').delete().in('id', ids)
  if (error) return res.status(500).json({ error: error.message })

  return res.status(200).json({ success: true, deleted: ids.length })
}
