import { useEffect, useState } from 'react'
import AdminLayout from '../../../components/AdminLayout'
import Toast from '../../../components/Toast'
import Link from 'next/link'

export default function AdminCertificates() {
  const [certs, setCerts] = useState([])
  const [toast, setToast] = useState(null)
  const [form, setForm] = useState({ name: '', issuer: '', date: '', url: '', status: 'Completed' })
  const [loading, setLoading] = useState(false)

  const fetchCerts = async () => {
    const res = await fetch('/api/certificates')
    setCerts(await res.json())
  }

  useEffect(() => { fetchCerts() }, [])

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
    if (res.ok) { setToast({ message: 'Deleted', type: 'success' }); fetchCerts() }
  }

  return (
    <AdminLayout title="Certificates">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Add form */}
      <div style={{ background: 'var(--dark2)', padding: '28px', border: '1px solid rgba(184,150,12,0.1)', marginBottom: '32px' }}>
        <div style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px' }}>Add Certificate</div>
        <form onSubmit={addCert}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Certificate Name *</label>
              <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Issuer</label>
              <input className="form-input" value={form.issuer} onChange={e => setForm({ ...form, issuer: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input className="form-input" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option>Completed</option>
                <option>In Progress</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Certificate URL (optional)</label>
            <input className="form-input" placeholder="https://..." value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} />
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '10px 28px', marginTop: '8px' }}>
            {loading ? 'Adding...' : '+ Add Certificate'}
          </button>
        </form>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {certs.map(cert => (
          <div key={cert.id} style={{ background: 'var(--dark2)', padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(184,150,12,0.05)' }}>
            <div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', color: 'var(--cream)' }}>{cert.name}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '4px' }}>{cert.issuer} {cert.date && `· ${cert.date}`}</div>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span className={`badge ${cert.status === 'Completed' ? 'badge-green' : ''}`}>{cert.status}</span>
              <button className="btn-danger" onClick={() => deleteCert(cert.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}
AdminCertificates.getInitialProps = () => ({ adminPage: true })
