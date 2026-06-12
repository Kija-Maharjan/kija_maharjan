import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  try {
    // Get excluded repos from settings
    const { data: settings } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'github_excluded')
      .single()

    const excludedRepos = settings?.value?.repos || []

    // Query synced repos from projects table (fast, no GitHub API call)
    const { data: projects } = await supabase
      .from('projects')
      .select('*')
      .not('github_url', 'is', null)

    if (projects && projects.length > 0) {
      const repos = projects.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description || '',
        language: Array.isArray(p.tech_stack) ? p.tech_stack[0] || '' : '',
        category: p.category || 'GitHub',
        stars: 0,
        github_url: p.github_url,
        homepage: p.hosted_url || '',
        updated_at: p.created_at,
        is_excluded: excludedRepos.includes(p.name)
      }))
      return res.status(200).json(repos)
    }

    // Fallback: fetch from GitHub API if no synced data
    const response = await fetch(`https://api.github.com/users/${process.env.GITHUB_USERNAME}/repos?sort=updated&per_page=100`, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        'User-Agent': 'KijaPortfolio',
        Accept: 'application/vnd.github.v3+json',
      }
    })

    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to fetch repos' })
    }

    const repos = await response.json()

    const filteredRepos = repos
      .filter(repo => !repo.fork && !repo.archived)
      .map(repo => ({
        id: repo.id,
        name: repo.name,
        description: repo.description || '',
        language: repo.language || '',
        category: repo.language || 'GitHub',
        stars: repo.stargazers_count,
        github_url: repo.html_url,
        homepage: repo.homepage || '',
        updated_at: repo.updated_at,
        is_excluded: excludedRepos.includes(repo.name)
      }))

    res.status(200).json(filteredRepos)
  } catch (error) {
    console.error('repos-public error:', error)
    res.status(500).json({ error: 'Failed to fetch repositories' })
  }
}
