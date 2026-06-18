import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import ProjectCard, { getProjectCardSize } from '../components/ProjectCard'
import { supabase } from '../lib/supabase'

export async function getServerSideProps() {
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('category', 'Food & Community')
    .order('created_at', { ascending: false })

  return { props: { projects: projects || [] } }
}

export default function Community({ projects }) {
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
    repo => !repo.is_excluded && repo.category === 'Food & Community'
  )

  const allItems = [
    ...projects.map(p => ({ ...p, type: 'project' })),
    ...visibleGithubRepos.map(r => ({
      id: r.id, name: r.name, description: r.description,
      category: r.category, tech_stack: r.language ? [r.language] : [],
      github_url: r.github_url, hosted_url: r.homepage || null, type: 'repo'
    }))
  ]

  const initiatives = [
    { label: 'Food Tech', desc: 'Digital solutions for restaurants, cafes, and food businesses' },
    { label: 'Community Platforms', desc: 'Building spaces where people connect and share' },
    { label: 'Local Impact', desc: 'Tech that empowers local businesses and communities' },
    { label: 'Shared Experiences', desc: 'From online menus to community events platforms' },
  ]

  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center relative overflow-hidden bg-plum">
        <div className="absolute inset-0 bg-gradient-to-br from-plum via-plum to-plum-light" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-rose/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-blush/5 rounded-full blur-3xl" />
        <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
          <div className="text-[9px] tracking-[5px] text-rose uppercase mb-6">Connection · Food · People</div>
          <h1 className="font-serif text-5xl md:text-7xl font-light text-pearl mb-6">
            <em className="text-rose italic">Community</em> & Food
          </h1>
          <p className="text-sm leading-relaxed text-text max-w-xl mx-auto">
            Technology that brings people together — from restaurant POS systems and online menus to platforms that strengthen local communities.
          </p>
        </div>
      </div>

      <div className="section-padding bg-plum-light">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-0.5 mb-16">
            {initiatives.map((m, i) => (
              <div key={i} className="bg-plum-lighter p-6 md:p-8 border-l-2 border-transparent hover:border-rose transition-all duration-300">
                <div className="font-serif text-sm text-rose tracking-[2px] uppercase mb-3">{m.label}</div>
                <p className="text-xs leading-relaxed text-mauve-dim">{m.desc}</p>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-2xl md:text-3xl font-light text-pearl mb-6 text-center">
              Tech That <em className="text-rose italic">Brings People Together</em>
            </h2>
            <p className="text-sm leading-relaxed text-text text-center">
              I believe technology serves people best when it strengthens real-world connections. 
              Whether it&apos;s a POS system that helps a cafe run smoothly, an online menu that makes 
              ordering effortless, or a community platform that fosters belonging — my goal is to build 
              tools that make a tangible difference in how people live, eat, and connect.
            </p>
          </div>

          <div className="flex items-center gap-5 mb-12">
            <span className="font-serif text-sm text-rose tracking-[2px]">Projects</span>
            <div className="w-12 h-px bg-rose/50" />
            <h2 className="font-serif text-2xl md:text-3xl font-light text-pearl">
              Community <em className="text-rose italic">Impact</em>
            </h2>
          </div>

          {loading ? (
            <div className="loader">Loading projects...</div>
          ) : allItems.length === 0 ? (
            <div className="text-center py-16 text-mauve-dim text-xs">No community projects yet</div>
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
