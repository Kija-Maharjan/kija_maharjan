import { useEffect, useState } from 'react'
import AdminLayout from '../../../components/AdminLayout'
import Toast from '../../../components/Toast'
import { useAdminAuth } from '../../../hooks/useAdminAuth'

export default function AdminArt() {
  const { isAuthenticated, loading: authLoading } = useAdminAuth()
  const [posts, setPosts] = useState([])
  const [toast, setToast] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', image_url: '', medium: '' })
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(true)

  const fetchPosts = async () => {
    const res = await fetch('/api/art-posts')
    const data = await res.json()
    setPosts(Array.isArray(data) ? data : [])
  }

  useEffect(() => { if (!authLoading && isAuthenticated) fetchPosts() }, [authLoading, isAuthenticated])

  if (authLoading) return <AdminLayout title="Art Gallery"><div className="text-center py-8 text-mauve-dim">Loading...</div></AdminLayout>
  if (!isAuthenticated) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const res = await fetch('/api/art-posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setToast({ message: 'Art added!', type: 'success' })
      setForm({ title: '', description: '', image_url: '', medium: '' })
      fetchPosts()
    } else {
      setToast({ message: 'Failed to add', type: 'error' })
    }
    setSubmitting(false)
  }

  const deletePost = async (id) => {
    if (!confirm('Delete this art piece?')) return
    const res = await fetch(`/api/art-posts/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setToast({ message: 'Deleted', type: 'success' })
      fetchPosts()
    }
  }

  return (
    <AdminLayout title="Art Gallery">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex justify-between items-center mb-6">
        <div className="text-xs tracking-wide" style={{ color: 'var(--mauve-dim)' }}>{posts.length} artworks</div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-[10px] px-5 py-2.5">
          {showForm ? '− Hide Form' : '+ New Artwork'}
        </button>
      </div>

      {showForm && (
        <div className="p-6 border mb-8" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}>
          <div className="text-[9px] tracking-[3px] uppercase mb-5" style={{ color: 'var(--accent)' }}>Add Artwork</div>
          <form onSubmit={handleSubmit}>
            <div className="form-row mb-4">
              <div>
                <label className="text-[9px] tracking-[2px] uppercase block mb-2" style={{ color: 'var(--mauve-dim)' }}>Title *</label>
                <input className="form-input" placeholder="e.g. Sunset Dreams" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div>
                <label className="text-[9px] tracking-[2px] uppercase block mb-2" style={{ color: 'var(--mauve-dim)' }}>Medium</label>
                <select className="form-select" value={form.medium} onChange={e => setForm({ ...form, medium: e.target.value })}>
                  <option value="">Select medium</option>
                  <option>Digital Art</option>
                  <option>Photography</option>
                  <option>Traditional</option>
                  <option>Graphic Design</option>
                  <option>3D / Render</option>
                  <option>Sketch</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="text-[9px] tracking-[2px] uppercase block mb-2" style={{ color: 'var(--mauve-dim)' }}>Image URL *</label>
              <input className="form-input" placeholder="https://..." value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} required />
            </div>
            <div className="mb-4">
              <label className="text-[9px] tracking-[2px] uppercase block mb-2" style={{ color: 'var(--mauve-dim)' }}>Description</label>
              <textarea className="form-textarea" placeholder="Describe your artwork..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <button type="submit" className="btn-primary text-[10px] px-6 py-2.5" disabled={submitting}>
              {submitting ? 'Adding...' : '+ Add Artwork'}
            </button>
          </form>
        </div>
      )}

      <div className="flex flex-col gap-0.5">
        {posts.map(post => (
          <div key={post.id} className="p-5 md:p-6 flex items-start gap-4 border transition-colors" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}>
            {post.image_url && (
              <div className="w-16 h-16 shrink-0 overflow-hidden rounded">
                <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1">
              <div className="font-serif text-lg" style={{ color: 'var(--pearl)' }}>{post.title}</div>
              {post.medium && <div className="text-[9px] tracking-[2px] uppercase mt-1" style={{ color: 'var(--mauve-dim)' }}>{post.medium}</div>}
            </div>
            <button className="btn-danger shrink-0" onClick={() => deletePost(post.id)}>Delete</button>
          </div>
        ))}
        {posts.length === 0 && <div className="text-center py-16 text-xs" style={{ color: 'var(--mauve-dim)' }}>No artworks yet</div>}
      </div>
    </AdminLayout>
  )
}
