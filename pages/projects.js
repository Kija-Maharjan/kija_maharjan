import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import ProjectCard, { getProjectCardSize } from '../components/ProjectCard'
import { supabase } from '../lib/supabase'

export async function getServerSideProps() {
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  return {
    props: { projects: projects || [] }
  }
}

export default function Projects({ projects }) {
  const [githubRepos, setGithubRepos] = useState([])
  const [visibleCategories, setVisibleCategories] = useState([])
  const [visibleRepos, setVisibleRepos] = useState([])
  const [selectedCategories, setSelectedCategories] = useState(new Set())
  const [loading, setLoading] = useState(true)

  const categories = ['Restaurant Tech', 'Cafe Tech', 'Education', 'Brand & Fashion', 'Browser Extension', 'Fitness', 'Personal Growth', 'Food & Community', 'GitHub']

  useEffect(() => {
    fetchSettingsAndRepos()
  }, [])

  const fetchSettingsAndRepos = async () => {
    try {
      // Fetch visibility settings from admin
      const settingsRes = await fetch('/api/admin/settings')
      const settings = await settingsRes.json()
      setVisibleCategories(settings.visible_categories || categories)
      setVisibleRepos(settings.visible_repos || [])
      setSelectedCategories(new Set(settings.visible_categories || categories))
    } catch (err) {
      console.error('Failed to fetch settings', err)
      setVisibleCategories(categories)
      setSelectedCategories(new Set(categories))
    }

    try {
      // Fetch GitHub repos
      const res = await fetch('/api/github/repos-public')
      const data = await res.json()
      setGithubRepos(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to fetch GitHub repos')
    }
    setLoading(false)
  }

  // Filter out excluded repos and respect admin visibility
  const visibleGithubRepos = githubRepos.filter(repo => !repo.is_excluded && visibleRepos.includes(repo.name))

  // Combine projects and repos
  const allItems = [
    ...projects.map(p => ({ ...p, type: 'project' })),
    ...visibleGithubRepos.map(r => ({
      id: r.id,
      name: r.name,
      description: r.description,
      category: r.category,
      tech_stack: r.language ? [r.language] : [],
      github_url: r.github_url,
      hosted_url: r.homepage || null,
      type: 'repo'
    }))
  ]
  
  const toggleCategory = (cat) => {
    const newSelected = new Set(selectedCategories)
    if (newSelected.has(cat)) {
      newSelected.delete(cat)
    } else {
      newSelected.add(cat)
    }
    setSelectedCategories(newSelected)
  }

  const filtered = allItems.filter(item => selectedCategories.has(item.category))

  return (
    <Layout>
      <div className="section-padding bg-dark-2 overflow-x-hidden">
        <div className="max-w-7xl mx-auto overflow-x-hidden">
          <div className="flex items-center gap-5 mb-12">
            <span className="font-serif text-sm text-gold tracking-[2px]">03</span>
            <div className="w-12 h-px bg-gold/50" />
            <h1 className="font-serif text-3xl md:text-5xl font-light text-cream">
              Past <em className="text-gold italic">Projects</em>
            </h1>
          </div>

          <div className="flex flex-wrap gap-2 mb-10">
            {visibleCategories.map(cat => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-4 py-2 text-[9px] tracking-[2px] uppercase font-sans cursor-pointer border transition-all duration-300 flex items-center gap-2 ${
                  selectedCategories.has(cat)
                    ? 'border-gold bg-gold-dim text-gold'
                    : 'border-gold/20 text-text-dim hover:border-gold/40'
                }`}
              >
                <span className={`w-4 h-4 border border-current flex items-center justify-center text-xs ${selectedCategories.has(cat) ? 'bg-gold text-dark-2' : ''}`}>
                  {selectedCategories.has(cat) ? '✓' : ''}
                </span>
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loader">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-text-dim text-xs">No projects found</div>
          ) : (
            <div className="masonry-grid">
              {filtered.map((item, index) => (
                <div key={`${item.type}-${item.id}`} className={`masonry-item ${getProjectCardSize(item.description)}`}>
                  <ProjectCard project={item} />
                </div>
              ))}
            </div>
          )}

          {!loading && githubRepos.length > 0 && (
            <div className="mt-8 text-center text-xs text-text-dim">
              Showing {visibleGithubRepos.length} of {githubRepos.length} GitHub repositories
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
