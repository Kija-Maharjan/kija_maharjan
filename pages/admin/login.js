import { useState } from 'react'
import { useRouter } from 'next/router'

export default function AdminLogin() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        router.push('/admin/dashboard')
      } else {
        const data = await res.json()
        setError(data.error || 'Invalid credentials')
      }
    } catch {
      setError('Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '48px', fontWeight: 300, color: 'var(--cream)' }}>
            K<span style={{ color: 'var(--gold)' }}>M</span>
          </div>
          <div style={{ fontSize: '9px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--text-dim)', marginTop: '8px' }}>
            Admin Access
          </div>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--dark2)', padding: '48px 40px', border: '1px solid rgba(184,150,12,0.1)' }}>
          <div style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '32px', textAlign: 'center' }}>
            Sign In
          </div>

          {error && (
            <div style={{ background: 'rgba(220,50,50,0.1)', border: '1px solid rgba(220,50,50,0.3)', color: '#e07070', padding: '12px 16px', fontSize: '11px', marginBottom: '20px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                className="form-input"
                type="text"
                placeholder="Admin username"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '16px', letterSpacing: '3px', marginTop: '8px', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '10px', color: 'var(--text-dim)' }}>
          <a href="/" style={{ color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '9px' }}>← Back to site</a>
        </div>
      </div>
    </div>
  )
}

AdminLogin.getInitialProps = () => ({ adminPage: true })
