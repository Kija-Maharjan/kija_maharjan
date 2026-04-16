import { fetchGithubRepos } from '../../../lib/github'
import { isAdmin } from '../../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()
  
  try {
    // Check if authenticated
    const authenticated = isAdmin(req)
    
    // Try to fetch GitHub repos
    const repos = await fetchGithubRepos()
    
    return res.status(200).json({
      authenticated,
      reposCount: repos.length,
      sampleRepo: repos[0] || null,
      repos: repos.slice(0, 5)
    })
  } catch (err) {
    return res.status(500).json({
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    })
  }
}
