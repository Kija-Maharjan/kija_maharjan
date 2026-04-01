import { useState } from 'react'
import Toast from '../components/Toast'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setToast({ message: 'Message sent successfully!', type: 'success' })
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setToast({ message: 'Failed to send. Try again.', type: 'error' })
      }
    } catch {
      setToast({ message: 'Something went wrong.', type: 'error' })
    }
    setLoading(false)
  }

  return (
    <div className="section section-alt" style={{ textAlign: 'center' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="section-header" style={{ justifyContent: 'center' }}>
        <span className="section-num">05</span>
        <div className="section-line" />
        <h1 className="section-title">Get In <em>Touch</em></h1>
      </div>
      <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 300, color: 'var(--cream)', maxWidth: '600px', margin: '0 auto 60px', lineHeight: 1.3 }}>
        Have a project in mind? Let us build something <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>remarkable</em> together.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px', maxWidth: '700px', margin: '0 auto 60px' }}>
        <a href="mailto:maharjankija@gmail.com" style={{ background: 'var(--dark3)', padding: '32px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{ fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-dim)' }}>Email</div>
          <div style={{ fontSize: '10px', color: 'var(--cream)', wordBreak: 'break-all' }}>maharjankija@gmail.com</div>
        </a>
        <a href="tel:+9779761722461" style={{ background: 'var(--dark3)', padding: '32px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{ fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-dim)' }}>Phone</div>
          <div style={{ fontSize: '11px', color: 'var(--cream)' }}>+977 9761722461</div>
        </a>
        <div style={{ background: 'var(--dark3)', padding: '32px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-dim)' }}>Location</div>
          <div style={{ fontSize: '11px', color: 'var(--cream)' }}>Kathmandu, Nepal</div>
        </div>
      </div>
      <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div className="form-row">
          <input className="form-input" placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <input className="form-input" type="email" placeholder="Your Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        </div>
        <input className="form-input" placeholder="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
        <textarea className="form-textarea" placeholder="Tell me about your project..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
        <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '2px', padding: '18px', letterSpacing: '4px', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  )
}
