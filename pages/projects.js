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
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    try {
      const [settingsRes, reposRes] = await Promise.all([
        fetch('/api/admin/settings', { signal: controller.signal }),
        fetch('/api/github/repos-public', { signal: controller.signal })
      ])

      const [settings, repos] = await Promise.all([
        settingsRes.json(),
        reposRes.json()
      ])

      setVisibleCategories(settings.visible_categories || categories)
      setVisibleRepos(settings.visible_repos || [])
      setSelectedCategories(new Set(settings.visible_categories || categories))
      setGithubRepos(Array.isArray(repos) ? repos : [])
    } catch (err) {
      console.error('Failed to fetch data', err)
      if (err.name !== 'AbortError') {
        setVisibleCategories(categories)
        setSelectedCategories(new Set(categories))
      }
    }
    clearTimeout(timeout)
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
      <div className="section-padding bg-plum-light overflow-x-hidden">
        <div className="max-w-7xl mx-auto overflow-x-hidden">
          <div className="flex items-center gap-5 mb-12">
            <span className="font-serif text-sm text-lavender tracking-[2px]">03</span>
            <div className="w-12 h-px bg-lavender/50" />
            <h1 className="font-serif text-3xl md:text-5xl font-light text-pearl">
              Past <em className="text-lavender italic">Projects</em>
            </h1>
          </div>

          <div className="flex flex-wrap gap-2 mb-10">
            {visibleCategories.map(cat => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-4 py-2 text-[9px] tracking-[2px] uppercase font-sans cursor-pointer border transition-all duration-300 flex items-center gap-2 ${
                  selectedCategories.has(cat)
                    ? 'border-lavender bg-lavender-dim text-lavender'
                    : 'border-lavender/20 text-mauve-dim hover:border-lavender/40'
                }`}
              >
                <span className={`w-4 h-4 border border-current flex items-center justify-center text-xs ${selectedCategories.has(cat) ? 'bg-lavender text-plum-light' : ''}`}>
                  {selectedCategories.has(cat) ? '✓' : ''}
                </span>
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loader">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-mauve-dim text-xs">No projects found</div>
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
            <div className="mt-8 text-center text-xs text-mauve-dim">
              Showing {visibleGithubRepos.length} of {githubRepos.length} GitHub repositories
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
