import { useEffect, useState } from 'react'
import AdminLayout from '../../../components/AdminLayout'
import Toast from '../../../components/Toast'
import Link from 'next/link'

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProjects = async () => {
    const res = await fetch('/api/projects')
    const data = await res.json()
    setProjects(data)
    setLoading(false)
  }

  useEffect(() => { fetchProjects() }, [])

  const deleteProject = async (id) => {
    if (!confirm('Delete this project?')) return
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setToast({ message: 'Project deleted', type: 'success' })
      fetchProjects()
    } else {
      setToast({ message: 'Failed to delete', type: 'error' })
    }
  }

  return (
    <AdminLayout title="Projects">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '1px' }}>{projects.length} projects total</div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/admin/github" className="btn-outline" style={{ padding: '10px 20px', fontSize: '9px' }}>⟳ GitHub Sync</Link>
          <Link href="/admin/projects/new" className="btn-primary" style={{ padding: '10px 20px', fontSize: '9px' }}>+ New Project</Link>
        </div>
      </div>

      {loading ? (
        <div className="loader">Loading...</div>
      ) : projects.length === 0 ? (
        <div className="loader">No projects yet. Add one!</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {projects.map(p => (
            <div key={p.id} style={{ background: 'var(--dark2)', padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(184,150,12,0.05)', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', color: 'var(--cream)', marginBottom: '4px' }}>{p.name}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginBottom: '8px' }}>{p.category}</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {p.github_url && <a href={p.github_url} target="_blank" rel="noreferrer" style={{ fontSize: '9px', color: 'var(--gold)', letterSpacing: '1px' }}>GitHub ↗</a>}
                  {p.hosted_url && <a href={p.hosted_url} target="_blank" rel="noreferrer" style={{ fontSize: '9px', color: '#a8e6a8', letterSpacing: '1px' }}>Live ↗</a>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                <Link href={`/admin/projects/edit/${p.id}`} className="btn-outline" style={{ padding: '8px 16px', fontSize: '9px' }}>Edit</Link>
                <button className="btn-danger" onClick={() => deleteProject(p.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}

AdminProjects.getInitialProps = () => ({ adminPage: true })
