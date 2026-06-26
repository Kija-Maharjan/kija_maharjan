import { useState } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '../../../components/AdminLayout'
import Toast from '../../../components/Toast'
import { useAdminAuth } from '../../../hooks/useAdminAuth'

const CATEGORIES = ['Restaurant Tech','Cafe Tech','Education','Brand & Fashion','Browser Extension','Fitness','Personal Growth','Food & Community','Web Development','Other']
const TYPES = ['website', 'extension', 'plymouth', 'sddm', 'app']

export default function NewProject() {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading } = useAdminAuth()
  const [form, setForm] = useState({ name: '', description: '', category: '', tech_stack: '', github_url: '', hosted_url: '', project_type: 'website' })
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)

  if (authLoading) return <AdminLayout title="New Project"><div className="text-center py-8 text-mauve-dim">Loading...</div></AdminLayout>
  if (!isAuthenticated) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const payload = { ...form, tech_stack: form.tech_stack.split(',').map(t => t.trim()).filter(Boolean) }
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      setToast({ message: 'Project created!', type: 'success' })
      setTimeout(() => router.push('/admin/projects'), 1500)
    } else {
      const data = await res.json()
      setToast({ message: data.error || 'Failed', type: 'error' })
    }
    setLoading(false)
  }

  return (
    <AdminLayout title="New Project">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <form onSubmit={handleSubmit} style={{ maxWidth: '700px' }}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Project Name *</label>
            <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Type</label>
            <select className="form-select" value={form.project_type} onChange={e => setForm({ ...form, project_type: e.target.value })}>
              {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
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
          <input className="form-input" placeholder="HTML, CSS, JavaScript, PHP" value={form.tech_stack} onChange={e => setForm({ ...form, tech_stack: e.target.value })} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">GitHub URL</label>
            <input className="form-input" placeholder="https://github.com/..." value={form.github_url} onChange={e => setForm({ ...form, github_url: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Hosted / Live URL</label>
            <input className="form-input" placeholder="https://..." value={form.hosted_url} onChange={e => setForm({ ...form, hosted_url: e.target.value })} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '12px 32px' }}>
            {loading ? 'Saving...' : 'Create Project'}
          </button>
          <button type="button" className="btn-outline" onClick={() => router.push('/admin/projects')} style={{ padding: '12px 32px' }}>Cancel</button>
        </div>
      </form>
    </AdminLayout>
  )
}
NewProject.getInitialProps = () => ({ adminPage: true })
