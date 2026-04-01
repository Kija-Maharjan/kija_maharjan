const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_USERNAME = process.env.GITHUB_USERNAME

export async function fetchGithubRepos() {
  const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=50`, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    },
  })
  if (!res.ok) throw new Error('Failed to fetch GitHub repos')
  const repos = await res.json()
  return repos.map(repo => ({
    github_id: repo.id,
    name: repo.name,
    description: repo.description || '',
    github_url: repo.html_url,
    homepage: repo.homepage || '',
    language: repo.language || '',
    stars: repo.stargazers_count,
    updated_at: repo.updated_at,
    topics: repo.topics || [],
  }))
}

export async function fetchSingleRepo(repoName) {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}`, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    },
  })
  if (!res.ok) throw new Error('Failed to fetch repo')
  return res.json()
}
