import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../components/Layout'

export default function Login() {
  const router = useRouter()
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/register'
    const body = tab === 'login'
      ? { username: form.username, password: form.password }
      : { username: form.username, email: form.email, password: form.password }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (res.ok) {
        if (tab === 'register') {
          setSuccess('Account created! Redirecting...')
        }
        setTimeout(() => router.push('/community'), 1000)
      } else {
        setError(data.error || 'Something went wrong.')
      }
    } catch {
      setError('Network error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-6 bg-plum">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="font-serif text-4xl font-light text-pearl mb-3">
              <em className="text-lavender italic">Join</em> the Community
            </h1>
            <p className="text-xs text-mauve-dim">Sign in to post reviews and chat messages</p>
          </div>

          <div className="flex mb-8 border-b border-lavender/10">
            <button
              onClick={() => { setTab('login'); setError(''); setSuccess('') }}
              className={`flex-1 pb-3 text-[10px] tracking-[3px] uppercase transition-colors ${tab === 'login' ? 'text-lavender border-b-2 border-lavender' : 'text-mauve-dim hover:text-pearl'}`}
            >
              Login
            </button>
            <button
              onClick={() => { setTab('register'); setError(''); setSuccess('') }}
              className={`flex-1 pb-3 text-[10px] tracking-[3px] uppercase transition-colors ${tab === 'register' ? 'text-lavender border-b-2 border-lavender' : 'text-mauve-dim hover:text-pearl'}`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-6 p-3 text-xs" style={{ backgroundColor: 'rgba(100,30,30,0.3)', border: '1px solid rgba(160,60,60,0.3)', color: '#e6a8a8' }}>
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 text-xs" style={{ backgroundColor: 'rgba(30,100,30,0.3)', border: '1px solid rgba(60,160,60,0.3)', color: '#a8e6a8' }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="text-[9px] tracking-[2px] uppercase block mb-2 text-mauve-dim">Username *</label>
              <input
                className="form-input"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                required
                minLength={3}
              />
            </div>

            {tab === 'register' && (
              <div className="mb-5">
                <label className="text-[9px] tracking-[2px] uppercase block mb-2 text-mauve-dim">Email (optional)</label>
                <input
                  className="form-input"
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
            )}

            <div className="mb-6">
              <label className="text-[9px] tracking-[2px] uppercase block mb-2 text-mauve-dim">Password *</label>
              <input
                className="form-input"
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
              />
            </div>

            <button type="submit" className="btn-primary w-full py-3 text-[10px]" disabled={loading}>
              {loading ? 'Please wait...' : tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/" className="text-[9px] tracking-[2px] uppercase text-mauve-dim hover:text-lavender transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}
