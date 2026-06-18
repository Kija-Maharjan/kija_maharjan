import { useEffect, useState } from 'react'
import AdminLayout from '../../../components/AdminLayout'
import Toast from '../../../components/Toast'
import { useAdminAuth } from '../../../hooks/useAdminAuth'

export default function AdminReviews() {
  const { isAuthenticated, loading: authLoading } = useAdminAuth()
  const [reviews, setReviews] = useState([])
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchReviews = async () => {
    const res = await fetch('/api/reviews')
    const data = await res.json()
    setReviews(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { if (!authLoading && isAuthenticated) fetchReviews() }, [authLoading, isAuthenticated])

  if (authLoading) return <AdminLayout title="Reviews"><div className="text-center py-8 text-mauve-dim">Loading...</div></AdminLayout>
  if (!isAuthenticated) return null

  const updateStatus = async (id, status) => {
    const res = await fetch(`/api/reviews/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setToast({ message: `Review ${status}`, type: 'success' })
      fetchReviews()
    }
  }

  const deleteReview = async (id) => {
    if (!confirm('Delete this review?')) return
    const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setToast({ message: 'Deleted', type: 'success' })
      fetchReviews()
    }
  }

  const statusColor = (status) => {
    if (status === 'approved') return '#4caf50'
    if (status === 'rejected') return '#e07070'
    return 'var(--accent)'
  }

  return (
    <AdminLayout title="Reviews">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex justify-between items-center mb-6">
        <div className="text-xs tracking-wide" style={{ color: 'var(--mauve-dim)' }}>{reviews.length} reviews</div>
      </div>

      {loading ? (
        <div className="loader">Loading...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 text-xs" style={{ color: 'var(--mauve-dim)' }}>No reviews yet</div>
      ) : (
        <div className="flex flex-col gap-0.5">
          {reviews.map(review => (
            <div key={review.id} className="p-5 md:p-6 border transition-colors" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-3">
                <div>
                  <div className="font-serif text-lg" style={{ color: 'var(--pearl)' }}>{review.reviewer_name}</div>
                  <div className="text-[9px] tracking-[2px] uppercase mt-1" style={{ color: 'var(--mauve-dim)' }}>
                    {review.project_name && <>on <span style={{ color: 'var(--accent)' }}>{review.project_name}</span> · </>}
                    {review.rating && <>Rating: {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)} · </>}
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>
                <span className="text-[9px] tracking-[1px] uppercase px-2 py-1 border self-start" style={{ color: statusColor(review.status), borderColor: statusColor(review.status) }}>
                  {review.status}
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text)' }}>{review.content}</p>
              <div className="flex gap-2">
                {review.status !== 'approved' && (
                  <button className="btn-outline text-[10px] px-4 py-1.5" onClick={() => updateStatus(review.id, 'approved')}>Approve</button>
                )}
                {review.status !== 'rejected' && (
                  <button className="btn-danger text-[10px] px-4 py-1.5" onClick={() => updateStatus(review.id, 'rejected')}>Reject</button>
                )}
                <button className="btn-danger text-[10px] px-4 py-1.5" onClick={() => deleteReview(review.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
