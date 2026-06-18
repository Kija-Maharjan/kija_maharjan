import { supabase } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('chat_messages').select('*').order('created_at', { ascending: true })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const { user_name, user_email, message, project_name } = req.body
    const { data, error } = await supabase.from('chat_messages').insert([{ user_name, user_email, message, project_name }]).select()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data[0])
  }

  res.status(405).end()
}
