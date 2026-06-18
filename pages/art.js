import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import ProjectCard, { getProjectCardSize } from '../components/ProjectCard'
import { supabase } from '../lib/supabase'

const ART_CATEGORIES = ['Brand & Fashion', 'Art', 'Design']

export async function getServerSideProps() {
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .in('category', ART_CATEGORIES)
    .order('created_at', { ascending: false })

  return { props: { projects: projects || [] } }
}

export default function Art({ projects }) {
  const [githubRepos, setGithubRepos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/github/repos-public')
      .then(res => res.json())
      .then(data => setGithubRepos(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const visibleGithubRepos = githubRepos.filter(
    repo => !repo.is_excluded && ART_CATEGORIES.includes(repo.category)
  )

  const allItems = [
    ...projects.map(p => ({ ...p, type: 'project' })),
    ...visibleGithubRepos.map(r => ({
      id: r.id, name: r.name, description: r.description,
      category: r.category, tech_stack: r.language ? [r.language] : [],
      github_url: r.github_url, hosted_url: r.homepage || null, type: 'repo'
    }))
  ]

  const mediums = [
    { label: 'Brand Identity', desc: 'Logos, color systems, and visual language design' },
    { label: 'Fashion Tech', desc: 'Digital storefronts and lookbook experiences' },
    { label: 'Creative Dev', desc: 'Interactive galleries and artistic web experiences' },
    { label: 'Visual Design', desc: 'UI/UX with an artistic edge' },
  ]

  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center relative overflow-hidden bg-plum">
        <div className="absolute inset-0 bg-gradient-to-br from-plum via-plum to-plum-light" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-orchid/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-lavender/5 rounded-full blur-3xl" />
        <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
          <div className="text-[9px] tracking-[5px] text-orchid uppercase mb-6">Creativity · Expression · Design</div>
          <h1 className="font-serif text-5xl md:text-7xl font-light text-pearl mb-6">
            <em className="text-orchid italic">Art</em> & Design
          </h1>
          <p className="text-sm leading-relaxed text-text max-w-xl mx-auto">
            Where code meets canvas — branding, fashion tech, and visually-driven digital experiences crafted with an artistic eye.
          </p>
        </div>
      </div>

      <div className="section-padding bg-plum-light">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-0.5 mb-16">
            {mediums.map((m, i) => (
              <div key={i} className="bg-plum-lighter p-6 md:p-8 border-l-2 border-transparent hover:border-orchid transition-all duration-300">
                <div className="font-serif text-sm text-orchid tracking-[2px] uppercase mb-3">{m.label}</div>
                <p className="text-xs leading-relaxed text-mauve-dim">{m.desc}</p>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-2xl md:text-3xl font-light text-pearl mb-6 text-center">
              Design at the <em className="text-orchid italic">Intersection</em>
            </h2>
            <p className="text-sm leading-relaxed text-text text-center">
              Every brand has a story — I help tell it through design. From fashion lookbooks to brand identity systems, 
              I build digital experiences that are as visually compelling as they are functional. 
              My approach blends minimalist aesthetics with bold creative choices.
            </p>
          </div>

          <div className="flex items-center gap-5 mb-12">
            <span className="font-serif text-sm text-orchid tracking-[2px]">Portfolio</span>
            <div className="w-12 h-px bg-orchid/50" />
            <h2 className="font-serif text-2xl md:text-3xl font-light text-pearl">
              Creative <em className="text-orchid italic">Projects</em>
            </h2>
          </div>

          {loading ? (
            <div className="loader">Loading projects...</div>
          ) : allItems.length === 0 ? (
            <div className="text-center py-16 text-mauve-dim text-xs">No art & design projects yet</div>
          ) : (
            <div className="masonry-grid">
              {allItems.map((item, index) => (
                <div key={`${item.type}-${item.id}`} className={`masonry-item ${getProjectCardSize(item.description)}`}>
                  <ProjectCard project={item} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
