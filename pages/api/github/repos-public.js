import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  // Fetch GitHub repos
  const response = await fetch('https://api.github.com/users/Kija-Maharjan/repos?sort=updated&per_page=100', {
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

  // Get excluded repos from Supabase
  const { data: settings } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'github_excluded')
    .single()

  const excludedRepos = settings?.value?.repos || []

  // Filter out forks and archived, then map
  const filteredRepos = repos
    .filter(repo => !repo.fork && !repo.archived)
    .map(repo => ({
      id: repo.id,
      name: repo.name,
      description: repo.description || '',
      language: repo.language || '',
      stars: repo.stargazers_count,
      github_url: repo.html_url,
      homepage: repo.homepage || '',
      updated_at: repo.updated_at,
      is_excluded: excludedRepos.includes(repo.name)
    }))

  res.status(200).json(filteredRepos)
}
