import { supabase } from '../lib/supabase'
import ProjectCard from '../components/ProjectCard'
import { useState } from 'react'

export async function getServerSideProps() {
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  return {
    props: { projects: projects || [] }
  }
}

const CATEGORIES = ['All', 'Restaurant Tech', 'Cafe Tech', 'Education', 'Brand & Fashion', 'Browser Extension', 'Fitness', 'Personal Growth', 'Food & Community']

export default function Projects({ projects }) {
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter)

  return (
    <div className="section">
      <div className="section-header">
        <span className="section-num">03</span>
        <div className="section-line" />
        <h1 className="section-title">Past <em>Projects</em></h1>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '48px' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: '6px 16px',
              fontSize: '9px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              fontFamily: 'Montserrat, sans-serif',
              cursor: 'pointer',
              border: '1px solid',
              borderColor: filter === cat ? 'var(--gold)' : 'rgba(184,150,12,0.2)',
              background: filter === cat ? 'var(--gold-dim)' : 'transparent',
              color: filter === cat ? 'var(--gold)' : 'var(--text-dim)',
              transition: 'all 0.3s',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="loader">No projects found</div>
      ) : (
        <div className="grid-2">
          {filtered.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
