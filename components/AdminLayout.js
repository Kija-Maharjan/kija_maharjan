import { useRouter } from 'next/router'
import Link from 'next/link'

export default function AdminLayout({ children, title }) {
  const router = useRouter()

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '⊞' },
    { href: '/admin/projects', label: 'Projects', icon: '◈' },
    { href: '/admin/github', label: 'GitHub Sync', icon: '⟳' },
    { href: '/admin/certificates', label: 'Certificates', icon: '◉' },
    { href: '/admin/messages', label: 'Messages', icon: '◻' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', display: 'flex' }}>
      {/* Sidebar */}
      <div style={{ width: '240px', background: 'var(--dark2)', borderRight: '1px solid rgba(184,150,12,0.1)', position: 'fixed', top: 0, left: 0, bottom: 0, display: 'flex', flexDirection: 'column', padding: '32px 0' }}>
        <div style={{ padding: '0 24px 32px', borderBottom: '1px solid rgba(184,150,12,0.08)' }}>
          <Link href="/" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', color: 'var(--cream)', textDecoration: 'none' }}>
            K<span style={{ color: 'var(--gold)' }}>M</span>
          </Link>
          <div style={{ fontSize: '8px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--text-dim)', marginTop: '4px' }}>Admin Panel</div>
        </div>

        <nav style={{ flex: 1, padding: '24px 0' }}>
          {navItems.map(item => (
            <Link key={item.href} href={item.href}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 24px', fontSize: '10px', letterSpacing: '2px',
                textTransform: 'uppercase', textDecoration: 'none',
                color: router.pathname === item.href ? 'var(--gold)' : 'var(--text-dim)',
                borderLeft: router.pathname === item.href ? '2px solid var(--gold)' : '2px solid transparent',
                background: router.pathname === item.href ? 'var(--gold-dim)' : 'transparent',
                transition: 'all 0.3s',
              }}
            >
              <span style={{ fontSize: '14px' }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '24px', borderTop: '1px solid rgba(184,150,12,0.08)' }}>
          <Link href="/" style={{ display: 'block', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-dim)', textDecoration: 'none', marginBottom: '12px' }}>
            ← View Site
          </Link>
          <button onClick={logout} style={{ background: 'none', border: '1px solid rgba(184,150,12,0.2)', color: 'var(--text-dim)', padding: '8px 16px', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', width: '100%', transition: 'all 0.3s' }}>
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ marginLeft: '240px', flex: 1, padding: '40px', minHeight: '100vh' }}>
        {title && (
          <div style={{ marginBottom: '40px', paddingBottom: '24px', borderBottom: '1px solid rgba(184,150,12,0.1)' }}>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '36px', fontWeight: 300, color: 'var(--cream)' }}>{title}</h1>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
