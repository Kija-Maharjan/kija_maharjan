import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import ProjectCard, { getProjectCardSize } from '../components/ProjectCard'
import { supabase } from '../lib/supabase'

export async function getServerSideProps() {
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('category', 'Fitness')
    .order('created_at', { ascending: false })

  return { props: { projects: projects || [] } }
}

export default function Gym({ projects }) {
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
    repo => !repo.is_excluded && repo.category === 'Fitness'
  )

  const allItems = [
    ...projects.map(p => ({ ...p, type: 'project' })),
    ...visibleGithubRepos.map(r => ({
      id: r.id, name: r.name, description: r.description,
      category: r.category, tech_stack: r.language ? [r.language] : [],
      github_url: r.github_url, hosted_url: r.homepage || null, type: 'repo'
    }))
  ]

  const stats = [
    { num: '5+', label: 'Fitness Projects' },
    { num: '3', label: 'Gym Platforms' },
    { num: '2', label: 'Active Apps' },
    { num: '∞', label: 'Push-ups Coded' },
  ]

  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center relative overflow-hidden bg-plum">
        <div className="absolute inset-0 bg-gradient-to-br from-plum via-plum to-plum-light" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-lavender/5 rounded-full blur-3xl" />
        <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
          <div className="text-[9px] tracking-[5px] text-lavender uppercase mb-6">Discipline · Growth · Strength</div>
          <h1 className="font-serif text-5xl md:text-7xl font-light text-pearl mb-6">
            <em className="text-lavender italic">Fitness</em> & Gym
          </h1>
          <p className="text-sm leading-relaxed text-text max-w-xl mx-auto">
            From gym management platforms to personal fitness trackers — building technology that helps people move, grow, and stay consistent.
          </p>
        </div>
      </div>

      <div className="section-padding bg-plum-light">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-0.5 mb-16">
            {stats.map((stat, i) => (
              <div key={i} className="bg-plum-lighter p-6 md:p-8 text-center border-l-2 border-transparent hover:border-lavender transition-all duration-300">
                <div className="font-serif text-3xl md:text-4xl font-light text-lavender leading-tight">{stat.num}</div>
                <div className="text-[9px] tracking-[2px] uppercase text-mauve-dim mt-2">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-2xl md:text-3xl font-light text-pearl mb-6 text-center">
              Built for the <em className="text-lavender italic">Active Life</em>
            </h2>
            <p className="text-sm leading-relaxed text-text text-center">
              I develop fitness-focused digital solutions — from gym member management systems and workout trackers 
              to nutrition planning apps. Each project is designed with the end-user in mind: clean interfaces, 
              reliable data tracking, and seamless mobile experiences.
            </p>
          </div>

          <div className="flex items-center gap-5 mb-12">
            <span className="font-serif text-sm text-lavender tracking-[2px]">Projects</span>
            <div className="w-12 h-px bg-lavender/50" />
            <h2 className="font-serif text-2xl md:text-3xl font-light text-pearl">
              Gym & <em className="text-lavender italic">Fitness</em>
            </h2>
          </div>

          {loading ? (
            <div className="loader">Loading projects...</div>
          ) : allItems.length === 0 ? (
            <div className="text-center py-16 text-mauve-dim text-xs">No fitness projects yet</div>
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
