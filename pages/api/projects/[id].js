import { supabase } from '../../../lib/supabase'
import { isAdmin } from '../../../lib/auth'

export default async function handler(req, res) {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' })
  const { id } = req.query

  if (req.method === 'PUT') {
    const { name, description, category, tech_stack, github_url, hosted_url, project_type } = req.body
    const { data, error } = await supabase.from('projects').update({ name, description, category, tech_stack, github_url, hosted_url, project_type }).eq('id', id).select()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data[0])
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }

  res.status(405).end()
}
