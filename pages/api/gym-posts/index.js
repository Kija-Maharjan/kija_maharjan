import { supabase } from '../../../lib/supabase'
import { isAdmin } from '../../../lib/auth'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('gym_posts').select('*').order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' })
    const { title, content, image_url, workout_type, difficulty } = req.body
    const { data, error } = await supabase.from('gym_posts').insert([{ title, content, image_url, workout_type, difficulty }]).select()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data[0])
  }

  res.status(405).end()
}
