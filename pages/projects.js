import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import ProjectCard from '../components/ProjectCard'
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
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGithubRepos()
  }, [])

  const fetchGithubRepos = async () => {
    try {
      const res = await fetch('/api/github/repos-public')
      const data = await res.json()
      setGithubRepos(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to fetch GitHub repos')
    }
    setLoading(false)
  }

  // Filter out excluded repos
  const visibleRepos = githubRepos.filter(repo => !repo.is_excluded)

  // Combine projects and repos
  const allItems = [
    ...projects.map(p => ({ ...p, type: 'project' })),
    ...visibleRepos.map(r => ({
      id: r.id,
      name: r.name,
      description: r.description,
      category: r.language || 'GitHub',
      tech_stack: r.language ? [r.language] : [],
      github_url: r.github_url,
      hosted_url: r.homepage || null,
      type: 'repo'
    }))
  ]

  const categories = ['All', 'Restaurant Tech', 'Cafe Tech', 'Education', 'Brand & Fashion', 'Browser Extension', 'Fitness', 'Personal Growth', 'Food & Community', 'GitHub']
  const filtered = filter === 'All' 
    ? allItems 
    : filter === 'GitHub'
      ? allItems.filter(item => item.type === 'repo')
      : allItems.filter(item => item.category === filter)

  return (
    <Layout>
      <div className="section-padding bg-dark-2">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-5 mb-12">
            <span className="font-serif text-sm text-gold tracking-[2px]">03</span>
            <div className="w-12 h-px bg-gold/50" />
            <h1 className="font-serif text-3xl md:text-5xl font-light text-cream">
              Past <em className="text-gold italic">Projects</em>
            </h1>
          </div>

          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 text-[9px] tracking-[2px] uppercase font-sans cursor-pointer border transition-all duration-300 ${
                  filter === cat
                    ? 'border-gold bg-gold-dim text-gold'
                    : 'border-gold/20 text-text-dim hover:border-gold/40'
                }`}
              >
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
                <div key={`${item.type}-${item.id}`} className="masonry-item">
                  <ProjectCard project={item} />
                </div>
              ))}
            </div>
          )}

          {!loading && githubRepos.length > 0 && (
            <div className="mt-8 text-center text-xs text-text-dim">
              Showing {visibleRepos.length} of {githubRepos.length} GitHub repositories. 
              <a href="/admin/github-repos" className="text-gold ml-2 hover:underline">Manage repos →</a>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
