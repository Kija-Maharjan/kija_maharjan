import { supabase } from '../../../lib/supabase'
import { isAdmin } from '../../../lib/auth'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const { reviewer_name, reviewer_email, project_name, rating, content } = req.body
    const { data, error } = await supabase.from('reviews').insert([{
      reviewer_name, reviewer_email, project_name, rating, content,
      status: isAdmin(req) ? 'approved' : 'pending'
    }]).select()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data[0])
  }

  res.status(405).end()
}
