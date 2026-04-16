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
    setProjects(Array.isArray(data) ? data : [])
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
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="text-xs text-text-dim tracking-wide">{projects.length} projects total</div>
        <div className="flex gap-3">
          <Link href="/admin/github" className="btn-outline text-[10px] px-5 py-2.5">⟳ GitHub Sync</Link>
          <Link href="/admin/projects/new" className="btn-primary text-[10px] px-5 py-2.5">+ New Project</Link>
        </div>
      </div>

      {loading ? (
        <div className="loader">Loading...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 text-text-dim text-xs">
          No projects yet. Add one!
        </div>
      ) : (
        <div className="flex flex-col gap-0.5">
          {projects.map(p => (
            <div key={p.id} className="bg-dark-2 p-6 md:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-gold/5 hover:border-gold/20 transition-colors">
              <div className="flex-1">
                <div className="font-serif text-lg text-cream mb-1">{p.name}</div>
                <div className="text-xs text-text-dim mb-3">{p.category}</div>
                <div className="flex gap-4 flex-wrap">
                  {p.github_url && <a href={p.github_url} target="_blank" rel="noreferrer" className="text-[9px] text-gold tracking-wide hover:underline">GitHub ↗</a>}
                  {p.hosted_url && <a href={p.hosted_url} target="_blank" rel="noreferrer" className="text-[9px] text-green-400 tracking-wide hover:underline">Live ↗</a>}
                </div>
              </div>
              <div className="flex gap-2.5 shrink-0">
                <Link href={`/admin/projects/edit/${p.id}`} className="btn-outline text-[10px] px-4 py-2">Edit</Link>
                <button className="btn-danger" onClick={() => deleteProject(p.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
