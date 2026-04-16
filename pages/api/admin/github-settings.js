import { createClient } from '@supabase/supabase-js'
import { isAdmin } from '../../../lib/auth'

// Use service role key for server-side operations if available, otherwise anon key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { data: settings, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'github_excluded')
        .maybeSingle()
      
      if (error) {
        console.error('[GitHub Settings] GET error:', error)
        return res.status(500).json({ error: error.message })
      }
      return res.status(200).json(settings?.value?.repos || [])
    } catch (err) {
      console.error('[GitHub Settings] GET exception:', err)
      return res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'PUT' || req.method === 'POST') {
    if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' })
    
    try {
      const { repos } = req.body
      
      if (!Array.isArray(repos)) {
        return res.status(400).json({ error: 'repos must be an array' })
      }
      
      const { data, error } = await supabase
        .from('settings')
        .upsert({
          key: 'github_excluded',
          value: { repos },
          updated_at: new Date().toISOString()
        })
        .select()
      
      if (error) {
        console.error('[GitHub Settings] POST/PUT error:', error)
        return res.status(500).json({ error: error.message })
      }
      
      console.log('[GitHub Settings] Updated successfully with', repos.length, 'excluded repos')
      return res.status(200).json({ success: true })
    } catch (err) {
      console.error('[GitHub Settings] POST/PUT exception:', err)
      return res.status(500).json({ error: err.message })
    }
  }

  return res.status(405).end()
}
