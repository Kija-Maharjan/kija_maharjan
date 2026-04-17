import { supabase } from '../../../lib/supabase'
import { isAdmin } from '../../../lib/auth'

export default async function handler(req, res) {
  // GET - Fetch visibility settings
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .in('key', ['visible_categories', 'visible_repos'])

    if (error) {
      return res.status(200).json({
        visible_categories: ['Restaurant Tech', 'Cafe Tech', 'Education', 'Brand & Fashion', 'Browser Extension', 'Fitness', 'Personal Growth', 'Food & Community', 'GitHub'],
        visible_repos: []
      })
    }

    const settings = {}
    data.forEach(item => {
      settings[item.key] = item.value || {}
    })

    return res.status(200).json({
      visible_categories: settings.visible_categories?.categories || ['Restaurant Tech', 'Cafe Tech', 'Education', 'Brand & Fashion', 'Browser Extension', 'Fitness', 'Personal Growth', 'Food & Community', 'GitHub'],
      visible_repos: settings.visible_repos?.repos || []
    })
  }

  // POST - Update visibility settings
  if (req.method === 'POST') {
    if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' })

    const { visible_categories, visible_repos } = req.body

    try {
      // Update categories
      if (visible_categories) {
        await supabase
          .from('settings')
          .upsert([
            {
              key: 'visible_categories',
              value: { categories: visible_categories }
            }
          ], { onConflict: 'key' })
      }

      // Update repos
      if (visible_repos) {
        await supabase
          .from('settings')
          .upsert([
            {
              key: 'visible_repos',
              value: { repos: visible_repos }
            }
          ], { onConflict: 'key' })
      }

      return res.status(200).json({ success: true })
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  res.status(405).end()
}
