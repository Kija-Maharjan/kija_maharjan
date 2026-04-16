import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data: settings } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'github_excluded')
      .single()
    
    return res.status(200).json(settings?.value?.repos || [])
  }

  if (req.method === 'PUT' || req.method === 'POST') {
    const { repos } = req.body
    
    const { data, error } = await supabase
      .from('settings')
      .upsert({
        key: 'github_excluded',
        value: { repos },
        updated_at: new Date().toISOString()
      })
      .select()
    
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }

  return res.status(405).end()
}
