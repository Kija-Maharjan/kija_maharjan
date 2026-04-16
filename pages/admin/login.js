import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import { ThemeProvider } from '../../hooks/useTheme'

export default function AdminLogin() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
        localStorage.setItem('admin_session', 'true')
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

  const LoginContent = () => (
    <>
      <Head>
        <title>Admin Login — Kija Maharjan</title>
        <link rel="icon" type="image/png" href="/logo.png" />
      </Head>
      <div className="min-h-screen flex items-center justify-center p-5 bg-dark relative" style={{ backgroundColor: 'var(--dark)' }}>
        {/* Backdrop blur overlay */}
        <div className="fixed inset-0 bg-dark/30 backdrop-blur-sm z-40" />
        
        {/* Floating login box */}
        <div className="w-full max-w-md relative z-50">
          <div className="text-center mb-10">
            <div className="font-serif text-5xl font-light mb-2" style={{ color: 'var(--cream)' }}>
              K<span style={{ color: 'var(--gold)' }}>M</span>
            </div>
            <div className="text-[9px] tracking-[4px] uppercase mb-4" style={{ color: 'var(--text-dim)' }}>
              Admin Access
            </div>
            <div className="text-[8px] tracking-[2px] uppercase" style={{ color: '#ef4444' }}>
              Admins Only
            </div>
          </div>

          <div className="p-10 md:p-12 border bg-dark/50 backdrop-blur-xl rounded-xl" style={{ borderColor: 'rgba(184,150,12,0.25)' }}>
            <div className="text-[9px] tracking-[3px] uppercase mb-8 text-center" style={{ color: 'var(--gold)' }}>
              Sign In
            </div>

            {error && (
              <div className="p-3 text-xs mb-5 text-center border rounded-lg" style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-[9px] tracking-[2px] uppercase block mb-2" style={{ color: 'var(--text-dim)' }}>Username</label>
                <input
                  type="text"
                  placeholder="Enter username"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  className="form-input bg-dark/40 backdrop-blur-md"
                  required
                />
              </div>
              <div>
                <label className="text-[9px] tracking-[2px] uppercase block mb-2" style={{ color: 'var(--text-dim)' }}>Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="form-input pr-10 bg-dark/40 backdrop-blur-md"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: 'var(--text-dim)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-dim)'}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn-primary py-4 tracking-[3px] mt-4 rounded-lg" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>

          <div className="text-center mt-6">
            <Link href="/" className="text-[9px] tracking-[2px] uppercase hover:underline" style={{ color: 'var(--gold)' }}>
              ← Back to site
            </Link>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <ThemeProvider>
      <LoginContent />
    </ThemeProvider>
  )
}
