import { supabase } from '../../../lib/supabase'
import { isAdmin } from '../../../lib/auth'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' })
    const { name, description, category, tech_stack, github_url, hosted_url } = req.body
    const { data, error } = await supabase.from('projects').insert([{ name, description, category, tech_stack, github_url, hosted_url }]).select()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data[0])
  }

  res.status(405).end()
}
