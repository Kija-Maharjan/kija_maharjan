import { useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'

export default function AdminLogin() {
  const router = useRouter()
  const usernameRef = useRef(null)
  const passwordRef = useRef(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const username = usernameRef.current?.value || ''
    const password = passwordRef.current?.value || ''

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (res.ok) {
        localStorage.setItem('admin_session', 'true')
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true')
        }
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
    <>
      <Head>
        <title>Admin Login — Kija Maharjan</title>
        <link rel="icon" type="image/png" href="/logo.png" />
      </Head>
      <div className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden" style={{ backgroundColor: 'var(--plum)' }}>
        {/* Background blur effect - shows page behind */}
        <div 
          className="fixed inset-0 z-40" 
          style={{ 
            backdropFilter: 'blur(50px)',
            WebkitBackdropFilter: 'blur(50px)',
            background: 'rgba(17, 16, 16, 0.6)'
          }} 
        />
        
        {/* Floating login box */}
        <div className="w-full max-w-lg relative z-50">
          {/* Login Form Box */}
          <div className="p-10 md:p-12 border bg-plum/20 backdrop-blur-3xl rounded-lg" style={{ borderColor: 'rgba(255,255,255,0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px rgba(255,255,255,0.1)' }}>
            {/* Header - Inside the box */}
            <div className="text-center mb-8 pb-8 border-b border-white/10">
              <div className="font-serif text-4xl font-light mb-2" style={{ color: 'var(--pearl)' }}>
                K<span style={{ color: 'var(--accent)' }}>M</span>
              </div>
              <div className="text-[9px] tracking-[4px] uppercase mb-2" style={{ color: 'var(--mauve-dim)' }}>
                Admin Access
              </div>
              <div className="text-[8px] tracking-[2px] uppercase" style={{ color: '#ef4444' }}>
                Admins Only
              </div>
            </div>

            <div className="text-[9px] tracking-[3px] uppercase mb-8 text-center" style={{ color: 'var(--accent)' }}>
              Sign In
            </div>

            {error && (
              <div className="p-3 text-xs mb-5 text-center border rounded-lg" style={{ backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5" autoComplete="off" noValidate>
              <div>
                <label className="text-[9px] tracking-[2px] uppercase block mb-2" style={{ color: 'var(--mauve-dim)' }}>Username</label>
                <input
                  ref={usernameRef}
                  type="text"
                  placeholder="Enter username"
                  className="form-input bg-plum/40 backdrop-blur-md w-full"
                  required
                  autoComplete="off"
                  spellCheck="false"
                  data-lpignore="true"
                />
              </div>
              <div>
                <label className="text-[9px] tracking-[2px] uppercase block mb-2" style={{ color: 'var(--mauve-dim)' }}>Password</label>
                <div className="relative flex items-center">
                  <input
                    ref={passwordRef}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    className="form-input pr-10 bg-plum/40 backdrop-blur-md w-full"
                    required
                    autoComplete="off"
                    spellCheck="false"
                    data-lpignore="true"
                  />
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors cursor-pointer select-none"
                    style={{ color: 'var(--mauve-dim)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--mauve-dim)'}
                    role="button"
                    tabIndex="-1"
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
                  </div>
                </div>
              </div>

              {/* Remember Me */}
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded"
                  style={{ 
                    accentColor: 'var(--accent)',
                    cursor: 'pointer'
                  }}
                />
                <span className="text-[9px] tracking-[1px] uppercase" style={{ color: 'var(--mauve-dim)' }}>
                  Remember me
                </span>
              </label>

              <div className="flex gap-3 mt-4">
                <button type="submit" className="flex-1 btn-primary py-4 tracking-[3px] rounded-lg" disabled={loading}>
                  {loading ? 'Signing in...' : 'Log In'}
                </button>
              </div>
            </form>

            {/* Back to site - Inside the box at bottom */}
            <div className="text-center mt-8 pt-6 border-t border-white/10">
              <Link href="/" className="text-[9px] tracking-[2px] uppercase hover:text-lavender transition-colors" style={{ color: 'var(--accent)' }}>
                ← Back to site
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
