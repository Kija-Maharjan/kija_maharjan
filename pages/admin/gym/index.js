import { useEffect, useState } from 'react'
import AdminLayout from '../../../components/AdminLayout'
import Toast from '../../../components/Toast'
import { useAdminAuth } from '../../../hooks/useAdminAuth'

export default function AdminGym() {
  const { isAuthenticated, loading: authLoading } = useAdminAuth()
  const [posts, setPosts] = useState([])
  const [toast, setToast] = useState(null)
  const [form, setForm] = useState({ title: '', content: '', image_url: '', workout_type: '', difficulty: '' })
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(true)

  const fetchPosts = async () => {
    const res = await fetch('/api/gym-posts')
    const data = await res.json()
    setPosts(Array.isArray(data) ? data : [])
  }

  useEffect(() => { if (!authLoading && isAuthenticated) fetchPosts() }, [authLoading, isAuthenticated])

  if (authLoading) return <AdminLayout title="Gym Posts"><div className="text-center py-8 text-mauve-dim">Loading...</div></AdminLayout>
  if (!isAuthenticated) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const res = await fetch('/api/gym-posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setToast({ message: 'Post added!', type: 'success' })
      setForm({ title: '', content: '', image_url: '', workout_type: '', difficulty: '' })
      fetchPosts()
    } else {
      setToast({ message: 'Failed to add', type: 'error' })
    }
    setSubmitting(false)
  }

  const deletePost = async (id) => {
    if (!confirm('Delete this post?')) return
    const res = await fetch(`/api/gym-posts/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setToast({ message: 'Deleted', type: 'success' })
      fetchPosts()
    }
  }

  return (
    <AdminLayout title="Gym Posts">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex justify-between items-center mb-6">
        <div className="text-xs tracking-wide" style={{ color: 'var(--mauve-dim)' }}>{posts.length} workouts</div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-[10px] px-5 py-2.5">
          {showForm ? '− Hide Form' : '+ New Workout'}
        </button>
      </div>

      {showForm && (
        <div className="p-6 border mb-8" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}>
          <div className="text-[9px] tracking-[3px] uppercase mb-5" style={{ color: 'var(--accent)' }}>Add Workout Post</div>
          <form onSubmit={handleSubmit}>
            <div className="form-row mb-4">
              <div>
                <label className="text-[9px] tracking-[2px] uppercase block mb-2" style={{ color: 'var(--mauve-dim)' }}>Title *</label>
                <input className="form-input" placeholder="e.g. Push Day Routine" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div>
                <label className="text-[9px] tracking-[2px] uppercase block mb-2" style={{ color: 'var(--mauve-dim)' }}>Image URL</label>
                <input className="form-input" placeholder="https://..." value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
              </div>
            </div>
            <div className="form-row mb-4">
              <div>
                <label className="text-[9px] tracking-[2px] uppercase block mb-2" style={{ color: 'var(--mauve-dim)' }}>Workout Type</label>
                <select className="form-select" value={form.workout_type} onChange={e => setForm({ ...form, workout_type: e.target.value })}>
                  <option value="">Select type</option>
                  <option>Strength</option>
                  <option>Cardio</option>
                  <option>Flexibility</option>
                  <option>HIIT</option>
                  <option>Calisthenics</option>
                  <option>Full Body</option>
                </select>
              </div>
              <div>
                <label className="text-[9px] tracking-[2px] uppercase block mb-2" style={{ color: 'var(--mauve-dim)' }}>Difficulty</label>
                <select className="form-select" value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}>
                  <option value="">Select difficulty</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="text-[9px] tracking-[2px] uppercase block mb-2" style={{ color: 'var(--mauve-dim)' }}>Content</label>
              <textarea className="form-textarea" placeholder="Write your workout details..." value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
            </div>
            <button type="submit" className="btn-primary text-[10px] px-6 py-2.5" disabled={submitting}>
              {submitting ? 'Adding...' : '+ Add Post'}
            </button>
          </form>
        </div>
      )}

      <div className="flex flex-col gap-0.5">
        {posts.map(post => (
          <div key={post.id} className="p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border transition-colors" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-strong)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-light)'}>
            <div className="flex-1">
              <div className="font-serif text-lg" style={{ color: 'var(--pearl)' }}>{post.title}</div>
              <div className="flex gap-2 mt-1">
                {post.workout_type && <span className="text-[9px] tracking-[1px] uppercase px-2 py-0.5 border" style={{ color: 'var(--accent)', borderColor: 'var(--border-medium)' }}>{post.workout_type}</span>}
                {post.difficulty && <span className="text-[9px] tracking-[1px] uppercase px-2 py-0.5 border" style={{ color: 'var(--mauve-dim)', borderColor: 'var(--border-light)' }}>{post.difficulty}</span>}
              </div>
            </div>
            <button className="btn-danger" onClick={() => deletePost(post.id)}>Delete</button>
          </div>
        ))}
        {posts.length === 0 && <div className="text-center py-16 text-xs" style={{ color: 'var(--mauve-dim)' }}>No workouts yet</div>}
      </div>
    </AdminLayout>
  )
}
