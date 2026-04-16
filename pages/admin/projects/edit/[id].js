import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '../../../../components/AdminLayout'
import Toast from '../../../../components/Toast'
import { useAdminAuth } from '../../../../hooks/useAdminAuth'

const CATEGORIES = ['Restaurant Tech','Cafe Tech','Education','Brand & Fashion','Browser Extension','Fitness','Personal Growth','Food & Community','Web Development','Other']

export default function EditProject() {
  const router = useRouter()
  const { id } = router.query
  const { isAuthenticated, loading: authLoading } = useAdminAuth()
  const [form, setForm] = useState({ name: '', description: '', category: '', tech_stack: '', github_url: '', hosted_url: '' })
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)

  if (authLoading) return <AdminLayout title="Edit Project"><div className="text-center py-8 text-text-dim">Loading...</div></AdminLayout>
  if (!isAuthenticated) return null

  useEffect(() => {
    if (!id) return
    fetch('/api/projects').then(r => r.json()).then(projects => {
      const p = projects.find(p => p.id === parseInt(id))
      if (p) setForm({ ...p, tech_stack: (p.tech_stack || []).join(', ') })
    })
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const payload = { ...form, tech_stack: form.tech_stack.split(',').map(t => t.trim()).filter(Boolean) }
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      setToast({ message: 'Project updated!', type: 'success' })
      setTimeout(() => router.push('/admin/projects'), 1500)
    } else {
      setToast({ message: 'Failed to update', type: 'error' })
    }
    setLoading(false)
  }

  return (
    <AdminLayout title="Edit Project">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <form onSubmit={handleSubmit} style={{ maxWidth: '700px' }}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Project Name *</label>
            <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-textarea" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Tech Stack (comma separated)</label>
          <input className="form-input" value={form.tech_stack} onChange={e => setForm({ ...form, tech_stack: e.target.value })} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">GitHub URL</label>
            <input className="form-input" value={form.github_url} onChange={e => setForm({ ...form, github_url: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Hosted / Live URL</label>
            <input className="form-input" value={form.hosted_url} onChange={e => setForm({ ...form, hosted_url: e.target.value })} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '12px 32px' }}>{loading ? 'Saving...' : 'Update Project'}</button>
          <button type="button" className="btn-outline" onClick={() => router.push('/admin/projects')} style={{ padding: '12px 32px' }}>Cancel</button>
        </div>
      </form>
    </AdminLayout>
  )
}
EditProject.getInitialProps = () => ({ adminPage: true })
