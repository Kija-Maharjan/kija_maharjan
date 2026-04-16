import { useState } from 'react'
import Layout from '../components/Layout'
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
    <Layout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="section-padding bg-dark-2">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-5 mb-12">
            <span className="font-serif text-sm text-gold tracking-[2px]">05</span>
            <div className="w-12 h-px bg-gold/50" />
            <h1 className="font-serif text-3xl md:text-5xl font-light text-cream">
              Get In <em className="text-gold italic">Touch</em>
            </h1>
          </div>

          <p className="font-serif text-2xl md:text-4xl font-light text-cream max-w-xl mx-auto leading-snug mb-14">
            Have a project in mind? Let us build something <em className="text-gold italic">remarkable</em> together.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5 max-w-2xl mx-auto mb-14">
            <a href="mailto:maharjankija@gmail.com" className="bg-dark-3 p-6 md:p-8 flex flex-col items-center gap-3 hover:bg-dark transition-colors">
              <div className="text-[8px] tracking-[2px] uppercase text-text-dim">Email</div>
              <div className="text-[11px] text-cream break-all">maharjankija@gmail.com</div>
            </a>
            <a href="tel:+9779761722461" className="bg-dark-3 p-6 md:p-8 flex flex-col items-center gap-3 hover:bg-dark transition-colors">
              <div className="text-[8px] tracking-[2px] uppercase text-text-dim">Phone</div>
              <div className="text-[11px] text-cream">+977 9761722461</div>
            </a>
            <div className="bg-dark-3 p-6 md:p-8 flex flex-col items-center gap-3">
              <div className="text-[8px] tracking-[2px] uppercase text-text-dim">Location</div>
              <div className="text-[11px] text-cream">Kathmandu, Nepal</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="max-w-xl mx-auto flex flex-col gap-0.5">
            <div className="form-row">
              <input
                className="form-input"
                placeholder="Your Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                className="form-input"
                type="email"
                placeholder="Your Email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <input
              className="form-input"
              placeholder="Subject"
              value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })}
            />
            <textarea
              className="form-textarea"
              placeholder="Tell me about your project..."
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              required
            />
            <button type="submit" className="btn-primary mt-0.5 py-4 tracking-[4px]" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
