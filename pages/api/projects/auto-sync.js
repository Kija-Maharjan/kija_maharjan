import { fetchGithubRepos } from '../../../lib/github'
import { supabase } from '../../../lib/supabase'
import { isAdmin } from '../../../lib/auth'

// Language to category mapping
const languageToCategory = {
  'javascript': 'Web Development',
  'typescript': 'Web Development',
  'python': 'Education',
  'java': 'Web Development',
  'go': 'Web Development',
  'rust': 'Web Development',
  'react': 'Web Development',
  'vue': 'Web Development',
  'swift': 'Brand & Fashion',
  'kotlin': 'Brand & Fashion',
  'fitness': 'Fitness',
  'health': 'Fitness',
  'restaurant': 'Restaurant Tech',
  'cafe': 'Cafe Tech',
  'education': 'Education',
  'blog': 'Personal Growth',
  'portfolio': 'Personal Growth',
}

function categorizeRepo(repo) {
  const name = repo.name.toLowerCase()
  const desc = repo.description?.toLowerCase() || ''
  const lang = repo.language?.toLowerCase() || ''
  const combined = `${name} ${desc} ${lang}`.toLowerCase()

  // Check for keywords in name, description, or language
  for (const [keyword, category] of Object.entries(languageToCategory)) {
    if (combined.includes(keyword)) {
      return category
    }
  }

  // Default fallback
  if (lang) {
    return languageToCategory[lang] || 'Web Development'
  }
  return 'Web Development'
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const repos = await fetchGithubRepos()
    
    // Get excluded repos
    const { data: settings } = await supabase
      .from('github_settings')
      .select('excluded_repos')
      .single()
    
    const excludedRepos = settings?.excluded_repos || []

    let synced = 0
    let updated = 0
    let errors = []

    for (const repo of repos) {
      // Skip excluded repos
      if (excludedRepos.includes(repo.name)) continue

      try {
        const category = categorizeRepo(repo)
        
        // Check if project already exists
        const { data: existing } = await supabase
          .from('projects')
          .select('id')
          .eq('github_url', repo.github_url)
          .single()

        const projectData = {
          name: repo.name,
          description: repo.description || '',
          github_url: repo.github_url,
          hosted_url: repo.homepage || '',
          tech_stack: repo.language ? [repo.language] : [],
          category: category,
          updated_at: new Date().toISOString(),
        }

        if (existing) {
          await supabase
            .from('projects')
            .update(projectData)
            .eq('id', existing.id)
          updated++
        } else {
          await supabase
            .from('projects')
            .insert([{ ...projectData, created_at: new Date().toISOString() }])
          synced++
        }
      } catch (err) {
        errors.push({ repo: repo.name, error: err.message })
      }
    }

    return res.status(200).json({
      success: true,
      synced,
      updated,
      total: repos.length,
      excluded: excludedRepos.length,
      errors: errors.length > 0 ? errors : undefined
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
