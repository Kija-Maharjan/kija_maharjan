import { useEffect, useState } from 'react'
import AdminLayout from '../../../components/AdminLayout'
import Toast from '../../../components/Toast'
import { useAdminAuth } from '../../../hooks/useAdminAuth'

export default function AdminCertificates() {
  const { isAuthenticated, loading: authLoading } = useAdminAuth()
  const [certs, setCerts] = useState([])
  const [toast, setToast] = useState(null)
  const [form, setForm] = useState({ name: '', issuer: '', date: '', url: '', status: 'Completed' })
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(true)

  const fetchCerts = async () => {
    const res = await fetch('/api/certificates')
    const data = await res.json()
    setCerts(Array.isArray(data) ? data : [])
  }

  useEffect(() => { fetchCerts() }, [])

  if (authLoading) return <AdminLayout title="Certificates"><div className="text-center py-8 text-text-dim">Loading...</div></AdminLayout>
  if (!isAuthenticated) return null

  const addCert = async (e) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/certificates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setToast({ message: 'Certificate added!', type: 'success' })
      setForm({ name: '', issuer: '', date: '', url: '', status: 'Completed' })
      fetchCerts()
    } else {
      setToast({ message: 'Failed to add', type: 'error' })
    }
    setLoading(false)
  }

  const deleteCert = async (id) => {
    if (!confirm('Delete this certificate?')) return
    const res = await fetch(`/api/certificates/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setToast({ message: 'Deleted', type: 'success' })
      fetchCerts()
    }
  }

  return (
    <AdminLayout title="Certificates">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex justify-between items-center mb-6">
        <div className="text-xs tracking-wide" style={{ color: 'var(--text-dim)' }}>{certs.length} certificates</div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-[10px] px-5 py-2.5">
          {showForm ? '− Hide Form' : '+ Add Certificate'}
        </button>
      </div>

      {showForm && (
        <div className="p-6 border mb-8" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}>
          <div className="text-[9px] tracking-[3px] uppercase mb-5" style={{ color: 'var(--gold)' }}>Add Certificate</div>
          <form onSubmit={addCert}>
            <div className="form-row mb-4">
              <div>
                <label className="text-[9px] tracking-[2px] uppercase block mb-2" style={{ color: 'var(--text-dim)' }}>Certificate Name *</label>
                <input className="form-input" placeholder="e.g. AWS Solutions Architect" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="text-[9px] tracking-[2px] uppercase block mb-2" style={{ color: 'var(--text-dim)' }}>Issuer *</label>
                <input className="form-input" placeholder="e.g. Amazon Web Services" value={form.issuer} onChange={e => setForm({ ...form, issuer: e.target.value })} required />
              </div>
            </div>
            <div className="form-row mb-4">
              <div>
                <label className="text-[9px] tracking-[2px] uppercase block mb-2" style={{ color: 'var(--text-dim)' }}>Date</label>
                <input className="form-input" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              </div>
              <div>
                <label className="text-[9px] tracking-[2px] uppercase block mb-2" style={{ color: 'var(--text-dim)' }}>Status</label>
                <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option>Completed</option>
                  <option>In Progress</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="text-[9px] tracking-[2px] uppercase block mb-2" style={{ color: 'var(--text-dim)' }}>Certificate URL (optional)</label>
              <input className="form-input" placeholder="https://..." value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} />
            </div>
            <button type="submit" className="btn-primary text-[10px] px-6 py-2.5" disabled={loading}>
              {loading ? 'Adding...' : '+ Add Certificate'}
            </button>
          </form>
        </div>
      )}

      <div className="flex flex-col gap-0.5">
        {certs.map(cert => (
          <div key={cert.id} className="p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border transition-colors" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-strong)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-light)'}>
            <div>
              <div className="font-serif text-lg" style={{ color: 'var(--cream)' }}>{cert.name}</div>
              <div className="text-[10px] tracking-[2px] uppercase mt-1" style={{ color: 'var(--text-dim)' }}>{cert.issuer} {cert.date && `· ${cert.date}`}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`badge ${cert.status === 'Completed' ? 'badge-green' : ''}`}>{cert.status}</span>
              <button className="btn-danger" onClick={() => deleteCert(cert.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}
