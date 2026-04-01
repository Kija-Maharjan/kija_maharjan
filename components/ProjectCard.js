import Link from 'next/link'

export default function ProjectCard({ project, showAdmin = false, onDelete }) {
  return (
    <div className="project-card">
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

      <div className="project-links" style={{ marginTop: '20px' }}>
        {project.github_url && (
          <a href={project.github_url} target="_blank" rel="noreferrer" className="btn-outline" style={{ padding: '8px 20px', fontSize: '9px' }}>
            GitHub →
          </a>
        )}
        {project.hosted_url && (
          <a href={project.hosted_url} target="_blank" rel="noreferrer" className="btn-primary" style={{ padding: '8px 20px', fontSize: '9px' }}>
            Live Demo →
          </a>
        )}
      </div>

      {showAdmin && (
        <div style={{ marginTop: '16px', display: 'flex', gap: '10px', borderTop: '1px solid rgba(184,150,12,0.1)', paddingTop: '16px' }}>
          <Link href={`/admin/projects/edit/${project.id}`} className="btn-outline" style={{ padding: '6px 16px', fontSize: '9px' }}>
            Edit
          </Link>
          <button className="btn-danger" onClick={() => onDelete(project.id)}>
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
