import { useEffect, useState, useMemo } from 'react'
import AdminLayout from '../../../components/AdminLayout'
import Toast from '../../../components/Toast'
import Link from 'next/link'
import { useAdminAuth } from '../../../hooks/useAdminAuth'

export default function AdminProjects() {
  const { isAuthenticated, loading: authLoading } = useAdminAuth()
  const [projects, setProjects] = useState([])
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [sortBy, setSortBy] = useState('created_at')
  const [deleting, setDeleting] = useState(false)

  const fetchProjects = async () => {
    const res = await fetch('/api/projects')
    const data = await res.json()
    setProjects(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => {
    if (!authLoading && isAuthenticated) fetchProjects()
  }, [authLoading, isAuthenticated])

  const sorted = useMemo(() => {
    const list = [...projects]
    if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
    else list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    return list
  }, [projects, sortBy])

  const allSelected = sorted.length > 0 && selectedIds.size === sorted.length

  const toggleSelect = (id) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set())
    else setSelectedIds(new Set(sorted.map(p => p.id)))
  }

  const deleteSelected = async () => {
    if (!confirm(`Delete ${selectedIds.size} projects?`)) return
    setDeleting(true)
    const res = await fetch('/api/projects/bulk-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: [...selectedIds] }),
    })
    if (res.ok) {
      setToast({ message: `Deleted ${selectedIds.size} projects`, type: 'success' })
      setSelectedIds(new Set())
      fetchProjects()
    } else {
      setToast({ message: 'Bulk delete failed', type: 'error' })
    }
    setDeleting(false)
  }

  const deleteProject = async (id) => {
    if (!confirm('Delete this project?')) return
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setToast({ message: 'Project deleted', type: 'success' })
      selectedIds.delete(id)
      fetchProjects()
    } else {
      setToast({ message: 'Failed to delete', type: 'error' })
    }
  }

  if (authLoading) return <AdminLayout title="Projects"><div className="text-center py-8 text-mauve-dim">Loading...</div></AdminLayout>
  if (!isAuthenticated) return null

  return (
    <AdminLayout title="Projects">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="text-xs tracking-wide" style={{ color: 'var(--mauve-dim)' }}>{projects.length} projects</div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="text-[9px] tracking-[1px] uppercase px-3 py-1.5 border cursor-pointer"
            style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-light)', color: 'var(--mauve-dim)' }}
          >
            <option value="created_at">Newest</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Link href="/admin/settings" className="btn-outline text-[10px] px-5 py-2.5">&#9881; Visibility</Link>
          <Link href="/admin/github" className="btn-outline text-[10px] px-5 py-2.5">&#8635; GitHub Sync</Link>
          <Link href="/admin/projects/new" className="btn-primary text-[10px] px-5 py-2.5">+ New Project</Link>
        </div>
      </div>

      {selectedIds.size > 0 && (
        <div className="mb-4 p-3 flex items-center gap-4 border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-medium)' }}>
          <span className="text-[10px] tracking-wide" style={{ color: 'var(--pearl)' }}>{selectedIds.size} selected</span>
          <button className="btn-danger text-[10px] px-4 py-1.5" onClick={deleteSelected} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete Selected'}
          </button>
          <button
            className="text-[9px] tracking-[1px] uppercase px-3 py-1.5 border cursor-pointer"
            style={{ borderColor: 'var(--border-light)', color: 'var(--mauve-dim)' }}
            onClick={() => setSelectedIds(new Set())}
          >
            Clear
          </button>
        </div>
      )}

      {loading ? (
        <div className="loader">Loading...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 text-xs" style={{ color: 'var(--mauve-dim)' }}>
          No projects yet. Add one!
        </div>
      ) : (
        <div className="flex flex-col gap-0.5">
          <div className="p-3 flex items-center gap-3 text-[9px] tracking-[2px] uppercase" style={{ color: 'var(--mauve-dim)' }}>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="w-3.5 h-3.5 cursor-pointer"
                style={{ accentColor: 'var(--accent)' }}
              />
              Select All
            </label>
          </div>
          {sorted.map(p => (
            <div
              key={p.id}
              className="p-6 md:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border transition-colors"
              style={{
                backgroundColor: selectedIds.has(p.id) ? 'rgba(195,199,244,0.08)' : 'var(--bg-secondary)',
                borderColor: selectedIds.has(p.id) ? 'var(--accent)' : 'var(--border-light)',
              }}
              onMouseEnter={(e) => { if (!selectedIds.has(p.id)) e.currentTarget.style.borderColor = 'var(--border-strong)' }}
              onMouseLeave={(e) => { if (!selectedIds.has(p.id)) e.currentTarget.style.borderColor = 'var(--border-light)' }}
            >
              <div className="flex items-start gap-4 flex-1">
                <input
                  type="checkbox"
                  checked={selectedIds.has(p.id)}
                  onChange={() => toggleSelect(p.id)}
                  className="w-4 h-4 mt-1 cursor-pointer shrink-0"
                  style={{ accentColor: 'var(--accent)' }}
                />
                <div>
                  <div className="font-serif text-lg mb-1" style={{ color: 'var(--pearl)' }}>{p.name}</div>
                  <div className="text-xs mb-3" style={{ color: 'var(--mauve-dim)' }}>{p.category || 'Uncategorized'}</div>
                  <div className="flex gap-4 flex-wrap">
                    {p.github_url && <a href={p.github_url} target="_blank" rel="noreferrer" className="text-[9px] tracking-wide hover:underline" style={{ color: 'var(--accent)' }}>GitHub ↗</a>}
                    {p.hosted_url && <a href={p.hosted_url} target="_blank" rel="noreferrer" className="text-[9px] tracking-wide hover:underline" style={{ color: '#4caf50' }}>Live ↗</a>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2.5 shrink-0 ml-8 md:ml-0">
                <Link href={`/admin/projects/edit/${p.id}`} className="btn-outline text-[10px] px-4 py-2">Edit</Link>
                <button className="btn-danger text-[10px] px-4 py-2" onClick={() => deleteProject(p.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
