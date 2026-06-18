import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import ProjectCard from '../components/ProjectCard'
import { supabase } from '../lib/supabase'

const TYPES = [
  { id: 'website', label: 'Websites' },
  { id: 'extension', label: 'Extensions' },
  { id: 'plymouth', label: 'Plymouth' },
  { id: 'sddm', label: 'SDDM' },
  { id: 'app', label: 'Apps' },
]

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
  const [selectedTypes, setSelectedTypes] = useState(new Set(['website']))
  const [selectedCategories, setSelectedCategories] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [previewProject, setPreviewProject] = useState(null)

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
      <div className="min-h-[50vh] flex items-center justify-center relative overflow-hidden bg-plum">
        <div className="absolute inset-0 bg-gradient-to-br from-plum via-plum to-plum-light" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-lavender/5 rounded-full blur-3xl" />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <div className="text-[9px] tracking-[5px] text-lavender uppercase mb-6">
            Websites · Extensions · Themes · Apps
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-light text-pearl mb-6">
            My <em className="text-lavender italic">Projects</em>
          </h1>
          <p className="text-sm leading-relaxed text-text max-w-2xl mx-auto">
            A showcase of everything I&apos;ve built — from full websites and POS systems to browser extensions,
            Plymouth boot themes, SDDM login screens, and mobile apps. Browse by type or category below.
          </p>
        </div>
      </div>

      <div className="section-padding bg-plum-light overflow-x-hidden">
        <div className="max-w-7xl mx-auto overflow-x-hidden">
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
            <div className="loader">Loading projects...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-mauve-dim text-xs">No projects match your filters</div>
          ) : (
            <div className="flex flex-col gap-4">
              {filtered.map((project) => (
                <div
                  key={`${project.type}-${project.id}`}
                  className="bg-plum-light border border-transparent hover:border-lavender/20 transition-all duration-300 group"
                >
                  <div
                    className="p-6 md:p-8 cursor-pointer"
                    onClick={() => setPreviewProject(previewProject?.id === project.id ? null : project)}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="project-tag">{project.category || 'Project'}</div>
                        <div className="project-name">{project.name}</div>
                        <div className="project-desc">{project.description}</div>
                        {project.tech_stack && (
                          <div className="project-tech">
                            {project.tech_stack.map((t, i) => (
                              <span key={i} className="tech-tag">{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2.5 shrink-0">
                        {project.github_url && (
                          <a href={project.github_url} target="_blank" rel="noreferrer" className="btn-outline text-[10px] px-5 py-2.5" onClick={e => e.stopPropagation()}>
                            GitHub →
                          </a>
                        )}
                        {project.hosted_url && (
                          <a href={project.hosted_url} target="_blank" rel="noreferrer" className="btn-primary text-[10px] px-5 py-2.5" onClick={e => e.stopPropagation()}>
                            Live Demo →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {previewProject?.id === project.id && (
                    <div className="border-t border-lavender/10">
                      {project.hosted_url ? (
                        <div className="relative w-full" style={{ height: '70vh' }}>
                          <iframe
                            src={project.hosted_url}
                            className="w-full h-full border-0"
                            title={`${project.name} preview`}
                            sandbox="allow-scripts allow-same-origin allow-forms"
                            loading="lazy"
                          />
                          <div className="absolute top-3 right-3 flex gap-2">
                            <a
                              href={project.hosted_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[8px] tracking-[2px] uppercase bg-plum/80 backdrop-blur-sm text-pearl px-3 py-1.5 rounded hover:bg-plum transition-colors"
                            >
                              Open in new tab ↗
                            </a>
                          </div>
                        </div>
                      ) : project.github_url ? (
                        <div className="p-8 text-center">
                          <p className="text-xs text-mauve-dim mb-4">No live demo available for this project</p>
                          <a href={project.github_url} target="_blank" rel="noreferrer" className="btn-outline text-[10px] px-6 py-2.5">
                            View on GitHub →
                          </a>
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <p className="text-xs text-mauve-dim">No preview available</p>
                        </div>
                      )}
                    </div>
                  )}
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
