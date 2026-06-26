import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { supabaseAdmin } from '../lib/supabase'

const TYPES = [
  { id: 'website', label: 'Websites' },
  { id: 'extension', label: 'Extensions' },
  { id: 'plymouth', label: 'Plymouth' },
  { id: 'sddm', label: 'SDDM' },
  { id: 'app', label: 'Apps' },
]

export async function getServerSideProps() {
  const { data: projects } = await supabaseAdmin
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  return {
    props: { projects: projects || [] }
  }
}

export default function Projects({ projects }) {
  const [githubRepos, setGithubRepos] = useState([])
  const [selectedTypes, setSelectedTypes] = useState(new Set(['website']))
  const [selectedCategories, setSelectedCategories] = useState(new Set())
  const [loading, setLoading] = useState(true)

  const allCategories = ['Restaurant Tech', 'Cafe Tech', 'Education', 'Brand & Fashion', 'Browser Extension', 'Fitness', 'Personal Growth', 'Food & Community', 'GitHub']

  useEffect(() => {
    fetch('/api/github/repos-public')
      .then(res => res.json())
      .then(data => setGithubRepos(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const visibleGithubRepos = githubRepos.filter(repo => !repo.is_excluded)

  const allItems = [
    ...projects.map(p => ({ ...p, type: 'project' })),
    ...visibleGithubRepos.map(r => ({
      id: r.id, name: r.name, description: r.description,
      category: r.category || r.language || 'GitHub',
      tech_stack: r.language ? [r.language] : [],
      github_url: r.github_url, hosted_url: r.homepage || null,
      project_type: 'website', type: 'repo'
    }))
  ]

  const toggleType = (type) => {
    const newSet = new Set(selectedTypes)
    if (newSet.has(type)) {
      if (newSet.size > 1) newSet.delete(type)
    } else {
      newSet.add(type)
    }
    setSelectedTypes(newSet)
  }

  const toggleCategory = (cat) => {
    const newSet = new Set(selectedCategories)
    if (newSet.has(cat)) newSet.delete(cat)
    else newSet.add(cat)
    setSelectedCategories(newSet)
  }

  const typeFiltered = selectedTypes.size
    ? allItems.filter(item => selectedTypes.has(item.project_type || 'website'))
    : allItems

  const filtered = selectedCategories.size
    ? typeFiltered.filter(item => selectedCategories.has(item.category))
    : typeFiltered

  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center relative overflow-hidden bg-plum">
        <div className="absolute inset-0 bg-gradient-to-br from-plum via-plum to-plum-light" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-lavender/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-orchid/5 rounded-full blur-3xl" />
        <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
          <div className="text-[9px] tracking-[5px] text-lavender uppercase mb-6">Code · Design · Ship</div>
          <h1 className="font-serif text-5xl md:text-7xl font-light text-pearl mb-6">
            My <em className="text-lavender italic">Projects</em>
          </h1>
          <p className="text-sm leading-relaxed text-text max-w-xl mx-auto">
            Websites, extensions, themes, and apps — a collection of everything I&apos;ve built.
          </p>
        </div>
      </div>

      <div className="section-padding bg-plum-light">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-5 mb-8">
            <span className="font-serif text-sm text-lavender tracking-[2px]">Portfolio</span>
            <div className="w-12 h-px bg-lavender/50" />
            <h2 className="font-serif text-2xl md:text-3xl font-light text-pearl">
              All <em className="text-lavender italic">Work</em>
            </h2>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {TYPES.map(t => (
              <button
                key={t.id}
                onClick={() => toggleType(t.id)}
                className={`px-5 py-2.5 text-[9px] tracking-[2px] uppercase font-sans cursor-pointer border transition-all duration-300 ${
                  selectedTypes.has(t.id)
                    ? 'border-lavender bg-lavender-dim text-lavender'
                    : 'border-lavender/20 text-mauve-dim hover:border-lavender/40'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-10">
            {allCategories.map(cat => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-4 py-2 text-[9px] tracking-[2px] uppercase font-sans cursor-pointer border transition-all duration-300 flex items-center gap-2 ${
                  selectedCategories.has(cat)
                    ? 'border-lavender bg-lavender-dim text-lavender'
                    : 'border-lavender/20 text-mauve-dim hover:border-lavender/40'
                }`}
              >
                <span className={`w-3.5 h-3.5 border border-current flex items-center justify-center text-[8px] ${selectedCategories.has(cat) ? 'bg-lavender text-plum-light' : ''}`}>
                  {selectedCategories.has(cat) ? '✓' : ''}
                </span>
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-16 text-mauve-dim text-xs">Loading projects...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-mauve-dim text-xs">No projects match your filters</div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-0.5 space-y-0.5">
              {filtered.map((project) => (
                <div
                  key={`${project.type}-${project.id}`}
                  className="break-inside-avoid bg-plum-light group relative overflow-hidden border border-transparent hover:border-lavender/20 transition-all duration-300 p-6 md:p-8"
                >
                  <div className="text-[8px] tracking-[3px] uppercase text-lavender mb-3 font-medium">
                    {project.category || 'Project'}
                  </div>
                  <h3 className="font-serif text-xl text-pearl mb-2">{project.name}</h3>
                  <p className="text-xs leading-relaxed text-mauve-dim mb-4">
                    {project.description}
                  </p>
                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tech_stack.map((t, i) => (
                        <span key={i} className="text-[8px] tracking-[1px] px-2.5 py-1 border border-lavender/25 text-lavender uppercase">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2.5">
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noreferrer" className="btn-outline text-[9px] px-4 py-2">
                        GitHub ↗
                      </a>
                    )}
                    {project.hosted_url && (
                      <a href={project.hosted_url} target="_blank" rel="noreferrer" className="btn-primary text-[9px] px-4 py-2">
                        Live Demo ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && githubRepos.length > 0 && (
            <div className="mt-8 text-center text-xs text-mauve-dim">
              Includes {visibleGithubRepos.length} GitHub repositories
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
