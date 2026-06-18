import Link from 'next/link'

// Export function to determine card size based on description
export function getProjectCardSize(description) {
  const descLength = (description || '').length
  if (descLength > 150) {
    return 'md:col-span-2'
  }
  return 'md:col-span-1'
}

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
          <a href={project.github_url} target="_blank" rel="noreferrer" className="btn-outline text-[10px] px-5 py-2.5">
            GitHub →
          </a>
        )}
        {project.hosted_url && (
          <a href={project.hosted_url} target="_blank" rel="noreferrer" className="btn-primary text-[10px] px-5 py-2.5">
            Live Demo →
          </a>
        )}
      </div>

      {showAdmin && (
        <div className="flex gap-2.5 mt-4 border-t border-lavender/10 pt-4">
          <Link href={`/admin/projects/edit/${project.id}`} className="btn-outline text-[10px] px-4 py-2">
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
