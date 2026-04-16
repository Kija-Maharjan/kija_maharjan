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
  
  const admin = isAdmin(req)
  if (!admin) {
    console.log('Auto-sync: Not authenticated')
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    console.log('Auto-sync: Starting...')
    
    // Fetch repos from GitHub
    let repos
    try {
      repos = await fetchGithubRepos()
      console.log(`Auto-sync: Fetched ${repos.length} repos from GitHub`)
    } catch (err) {
      console.error('Auto-sync: GitHub fetch failed:', err.message)
      return res.status(500).json({ error: `GitHub fetch failed: ${err.message}` })
    }

    if (!repos || repos.length === 0) {
      console.log('Auto-sync: No repos found')
      return res.status(200).json({
        success: true,
        synced: 0,
        updated: 0,
        total: 0,
        excluded: 0,
        message: 'No repos found'
      })
    }
    
    // Get excluded repos from settings
    let excludedRepos = []
    try {
      const { data: settings } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'github_excluded')
        .maybeSingle()
      
      excludedRepos = settings?.value?.repos || []
      console.log(`Auto-sync: Found ${excludedRepos.length} excluded repos`)
    } catch (err) {
      console.log('Auto-sync: Could not fetch excluded repos (continuing):', err.message)
    }

    let synced = 0
    let updated = 0
    let errors = []

    for (const repo of repos) {
      try {
        // Skip excluded repos
        if (excludedRepos.includes(repo.name)) {
          console.log(`Auto-sync: Skipping excluded repo ${repo.name}`)
          continue
        }

        const category = categorizeRepo(repo)
        
        // Check if project already exists by github_url
        const { data: existing, error: checkError } = await supabase
          .from('projects')
          .select('id')
          .eq('github_url', repo.github_url)
          .maybeSingle()

        if (checkError) {
          console.error(`Auto-sync: Check error for ${repo.name}:`, checkError)
          throw checkError
        }

        const projectData = {
          name: repo.name,
          description: repo.description || '',
          github_url: repo.github_url,
          hosted_url: repo.homepage || '',
          tech_stack: repo.language ? [repo.language] : [],
          category: category,
        }

        if (existing) {
          const { error: updateError } = await supabase
            .from('projects')
            .update(projectData)
            .eq('id', existing.id)
          
          if (updateError) {
            console.error(`Auto-sync: Update error for ${repo.name}:`, updateError)
            throw updateError
          }
          console.log(`Auto-sync: Updated ${repo.name}`)
          updated++
        } else {
          const { error: insertError } = await supabase
            .from('projects')
            .insert([{ ...projectData, created_at: new Date().toISOString() }])
          
          if (insertError) {
            console.error(`Auto-sync: Insert error for ${repo.name}:`, insertError)
            throw insertError
          }
          console.log(`Auto-sync: Synced ${repo.name}`)
          synced++
        }
      } catch (err) {
        const errorMsg = err.message || JSON.stringify(err)
        console.error(`Auto-sync: Error processing ${repo.name}:`, errorMsg)
        errors.push({ repo: repo.name, error: errorMsg })
      }
    }

    console.log(`Auto-sync: Complete - Synced: ${synced}, Updated: ${updated}, Errors: ${errors.length}`)
    return res.status(200).json({
      success: true,
      synced,
      updated,
      total: repos.length,
      excluded: excludedRepos.length,
      errors: errors.length > 0 ? errors : undefined
    })
  } catch (err) {
    console.error('Auto-sync fatal error:', err)
    return res.status(500).json({ 
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err.toString() : undefined
    })
  }
}
