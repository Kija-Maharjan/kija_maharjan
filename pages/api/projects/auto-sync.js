import { fetchGithubRepos } from '../../../lib/github'
import { supabase } from '../../../lib/supabase'
import { isAdmin } from '../../../lib/auth'

// Comprehensive keyword to category mapping
const categoryKeywords = {
  'Restaurant Tech': ['restaurant', 'food delivery', 'menu', 'ordering', 'pos system', 'pos', 'dine', 'restaurant system', 'ordering system', 'food service', 'restaurant app', 'food truck', 'catering', 'online ordering', 'table management', 'reservation', 'order management', 'qr code', 'digital menu', 'dining', 'restaurant website', 'food ordering', 'delivery system', 'takeout'],
  'Cafe Tech': ['cafe', 'coffee', 'bakery', 'shop', 'retail', 'menu system', 'cafe system', 'cafe website', 'coffee shop', 'online menu', 'trios', 'coffee app', 'barista', 'pastry', 'cafe ordering', 'coffee ordering', 'cafe management', 'store system', 'shop system', 'retail system'],
  'Education': ['education', 'learn', 'course', 'school', 'training', 'tutorial', 'educational', 'python', 'java', 'academy', 'learning platform', 'study', 'nexus', 'student', 'teacher', 'course platform', 'e-learning', 'online class', 'online course', 'classroom', 'lesson', 'training program', 'skill learning', 'knowledge base', 'learning app', 'educational platform'],
  'Brand & Fashion': ['brand', 'fashion', 'design', 'ui', 'ux', 'portfolio', 'swift', 'kotlin', 'mobile app', 'clothing', 'cloths', 'apparel', 'aura', 'luswaa', 'style', 'wardrobe', 'boutique', 'ecommerce', 'shopping', 'fashion app', 'clothing store', 'brand identity', 'product design', 'merchandise', 'designer'],
  'Browser Extension': ['extension', 'chrome', 'firefox', 'addon', 'plugin', 'keyboard', 'sound', 'vscode', 'vs code', 'brave', 'productivity', 'tool', 'browser tool', 'automation', 'chrome extension', 'browser addon', 'typing', 'keystroke', 'shortcut', 'utility'],
  'Fitness': ['fitness', 'gym', '100kg', '71kg', 'workout', 'exercise', 'health', 'wellness', 'diet', 'trainer', 'sport', 'athlete', 'running', 'yoga', 'gym bro', 'beast', 'strength', 'bodyweight', 'cardio', 'weights', 'training program', 'fitness tracker', 'gym app', 'workout plan', 'exercise routine', 'health app', 'sports', 'athletic', 'cub', 'bro', 'website for gym', 'fitness website'],
  'Personal Growth': ['blog', 'portfolio', 'personal', 'resume', 'cv', 'website', 'landing', 'growth', 'development', 'learning', 'self', 'improvement', 'personal project', 'kija', 'programmer', 'coding', 'freestyle', 'workflow', 'portfolio website', 'personal site', 'personal blog', 'dev portfolio', 'self improvement', 'professional growth', 'skill development', 'coding project'],
  'Food & Community': ['food', 'community', 'social', 'networking', 'meetup', 'forum', 'discussion', 'restaurant', 'meal', 'cook', 'recipe', 'delivery', 'recipe streak', 'recipe learning', 'cooking', 'food learning', 'sharing', 'social cooking', 'community cooking', 'recipe sharing', 'food sharing', 'meal sharing', 'culinary', 'kitchen', 'ingredient', 'food blog', 'cooking community', 'share and enjoy', 'learn share'],
  'Web Development': ['web', 'website', 'frontend', 'backend', 'fullstack', 'react', 'vue', 'angular', 'nodejs', 'express', 'django', 'flask', 'next', 'svelte', 'api', 'rest', 'graphql', 'tech', 'app', 'application', 'server', 'client', 'database', 'web app', 'full stack', 'javascript', 'typescript', 'html', 'css', 'web framework', 'web service', 'saas', 'platform'],
}

// Language to category fallback
const languageFallback = {
  'javascript': 'Web Development',
  'typescript': 'Web Development',
  'python': 'Education',
  'java': 'Web Development',
  'go': 'Web Development',
  'rust': 'Web Development',
  'swift': 'Brand & Fashion',
  'kotlin': 'Brand & Fashion',
  'ruby': 'Web Development',
  'php': 'Web Development',
  'c#': 'Web Development',
  'c++': 'Web Development',
}

function categorizeRepo(repo) {
  const name = repo.name.toLowerCase().replace(/[-_]/g, ' ')
  const desc = repo.description?.toLowerCase().replace(/[-_]/g, ' ') || ''
  const lang = repo.language?.toLowerCase() || ''
  const combined = `${name} ${desc} ${lang}`

  // Check each category's keywords
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      const normalizedKeyword = keyword.toLowerCase().replace(/[-_]/g, ' ')
      if (combined.includes(normalizedKeyword)) {
        return category
      }
    }
  }

  // Language fallback
  if (lang && languageFallback[lang]) {
    return languageFallback[lang]
  }

  // Default fallback
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
