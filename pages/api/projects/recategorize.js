import { supabase } from '../../../lib/supabase'
import { isAdmin } from '../../../lib/auth'

// Comprehensive keyword to category mapping
const categoryKeywords = {
  'Restaurant Tech': ['restaurant', 'food delivery', 'menu', 'ordering', 'pos system', 'pos', 'dine', 'restaurant system', 'ordering system', 'food service', 'restaurant app', 'food truck', 'catering', 'online ordering', 'table management', 'reservation', 'order management', 'qr code', 'digital menu', 'dining', 'restaurant website', 'food ordering', 'delivery system', 'takeout'],
  'Cafe Tech': ['cafe', 'coffee', 'bakery', 'shop', 'retail', 'menu system', 'cafe system', 'cafe website', 'coffee shop', 'online menu', 'trios', 'coffee app', 'barista', 'pastry', 'cafe ordering', 'coffee ordering', 'cafe management', 'store system', 'shop system', 'retail system'],
  'Education': ['education', 'learn', 'course', 'school', 'training', 'tutorial', 'educational', 'python', 'java', 'academy', 'learning platform', 'study', 'nexus', 'student', 'teacher', 'course platform', 'e-learning', 'online class', 'online course', 'classroom', 'lesson', 'training program', 'skill learning', 'knowledge base', 'learning app', 'educational platform'],
  'Brand & Fashion': ['brand', 'fashion', 'design', 'ui', 'ux', 'portfolio', 'swift', 'kotlin', 'mobile app', 'clothing', 'cloths', 'apparel', 'aura', 'luswaa', 'style', 'wardrobe', 'boutique', 'ecommerce', 'shopping', 'fashion app', 'clothing store', 'brand identity', 'product design', 'merchandise', 'designer'],
  'Browser Extension': ['extension', 'chrome', 'firefox', 'addon', 'plugin', 'keyboard', 'sound', 'vscode', 'vs code', 'brave', 'productivity', 'tool', 'browser tool', 'automation', 'chrome extension', 'browser addon', 'typing', 'keystroke', 'shortcut', 'utility'],
  'Fitness': ['fitness', 'gym', '100kg', '71kg', 'workout', 'exercise', 'health', 'wellness', 'diet', 'trainer', 'sport', 'athlete', 'running', 'yoga', 'gym-bro', 'beast', 'strength', 'bodyweight', 'cardio', 'weights', 'training program', 'fitness tracker', 'gym app', 'workout plan', 'exercise routine', 'health app', 'sports', 'athletic'],
  'Personal Growth': ['blog', 'portfolio', 'personal', 'resume', 'cv', 'website', 'landing', 'growth', 'development', 'learning', 'self', 'improvement', 'personal project', 'kija', 'programmer', 'coding', 'freestyle', 'workflow', 'portfolio website', 'personal site', 'personal blog', 'dev portfolio', 'self improvement', 'professional growth', 'skill development', 'coding project'],
  'Food & Community': ['food', 'community', 'social', 'networking', 'meetup', 'forum', 'discussion', 'restaurant', 'meal', 'cook', 'recipe', 'delivery', 'recipe streak', 'recipe learning', 'cooking', 'food learning', 'sharing', 'social cooking', 'community cooking', 'recipe sharing', 'food sharing', 'meal sharing', 'culinary', 'kitchen', 'ingredient', 'food blog', 'cooking community'],
  'Web Development': ['web', 'website', 'frontend', 'backend', 'fullstack', 'react', 'vue', 'angular', 'nodejs', 'express', 'django', 'flask', 'next', 'svelte', 'api', 'rest', 'graphql', 'tech', 'app', 'application', 'server', 'client', 'database', 'web app', 'full stack', 'javascript', 'typescript', 'html', 'css', 'web framework', 'web service', 'saas', 'platform'],
}

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

function categorizeProject(project) {
  const name = project.name?.toLowerCase() || ''
  const desc = project.description?.toLowerCase() || ''
  const tech = (project.tech_stack || []).join(' ').toLowerCase()
  const combined = `${name} ${desc} ${tech}`

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (combined.includes(keyword)) {
        return category
      }
    }
  }

  return 'Web Development'
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' })

  try {
    console.log('Recategorizing: Fetching all projects...')
    
    const { data: projects, error: fetchError } = await supabase
      .from('projects')
      .select('*')
    
    if (fetchError) throw fetchError
    
    if (!projects || projects.length === 0) {
      return res.status(200).json({
        success: true,
        recategorized: 0,
        message: 'No projects to recategorize'
      })
    }

    let recategorized = 0
    let errors = []

    for (const project of projects) {
      try {
        const newCategory = categorizeProject(project)
        
        if (newCategory !== project.category) {
          const { error: updateError } = await supabase
            .from('projects')
            .update({ category: newCategory })
            .eq('id', project.id)
          
          if (updateError) throw updateError
          console.log(`Recategorized ${project.name} to ${newCategory}`)
          recategorized++
        }
      } catch (err) {
        errors.push({ project: project.name, error: err.message })
      }
    }

    console.log(`Recategorize complete - Updated: ${recategorized}`)
    return res.status(200).json({
      success: true,
      recategorized,
      total: projects.length,
      errors: errors.length > 0 ? errors : undefined
    })
  } catch (err) {
    console.error('Recategorize error:', err)
    return res.status(500).json({ 
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err.toString() : undefined
    })
  }
}
