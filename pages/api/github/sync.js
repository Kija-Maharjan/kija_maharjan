import { fetchGithubRepos } from '../../../lib/github'
import { supabase } from '../../../lib/supabase'
import { isAdmin } from '../../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const repos = await fetchGithubRepos()
    const { repoName } = req.body

    // Find the repo
    const repo = repos.find(r => r.name === repoName)
    if (!repo) return res.status(404).json({ error: 'Repo not found' })

    // Upsert into projects table based on github_url
    const { data: existing } = await supabase.from('projects').select('id').eq('github_url', repo.github_url).single()

    const projectData = {
      name: repo.name,
      description: repo.description,
      github_url: repo.github_url,
      hosted_url: repo.homepage || '',
      tech_stack: repo.language ? [repo.language] : [],
    }

    let result
    if (existing) {
      result = await supabase.from('projects').update(projectData).eq('id', existing.id).select()
    } else {
      result = await supabase.from('projects').insert([projectData]).select()
    }

    if (result.error) return res.status(500).json({ error: result.error.message })
    return res.status(200).json({ success: true, project: result.data[0] })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
