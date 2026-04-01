import { fetchGithubRepos } from '../../../lib/github'
import { isAdmin } from '../../../lib/auth'

export default async function handler(req, res) {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const repos = await fetchGithubRepos()
    return res.status(200).json(repos)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
