import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { clearAdminSession } from '../hooks/useAdminAuth'

export default function AdminLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [logoutModal, setLogoutModal] = useState(false)
  const router = useRouter()

  const logout = async () => {
    console.log('[Admin] Logging out...')
    clearAdminSession()
    await fetch('/api/admin/logout', { method: 'POST' })
    console.log('[Admin] Redirecting to home page')
    window.location.href = '/'
  }

  useEffect(() => { setSidebarOpen(false) }, [router.pathname])

  useEffect(() => {
    if (sidebarOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
      </svg>
    )},
    { href: '/admin/projects', label: 'Projects', icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
      </svg>
    )},
    { href: '/admin/github', label: 'GitHub Sync', icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
      </svg>
    )},
    { href: '/admin/github-repos', label: 'GitHub Repos', icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 012 2v7M6 9v12"/>
      </svg>
    )},
    { href: '/admin/certificates', label: 'Certificates', icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
      </svg>
    )},
    { href: '/admin/gym', label: 'Gym Posts', icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6.5 6.5h11M6.5 17.5h11M3 12h18M3 6.5v11M21 6.5v11"/>
      </svg>
    )},
    { href: '/admin/art', label: 'Art Gallery', icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
      </svg>
    )},
    { href: '/admin/reviews', label: 'Reviews', icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 20l-3-3H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-4l-3 3z"/><path d="M8 9h8M8 13h6"/>
      </svg>
    )},
    { href: '/admin/messages', label: 'Messages', icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    )},
  ]

  const isActive = (href) => {
    if (href === '/admin/projects') return router.pathname.startsWith('/admin/projects')
    return router.pathname === href
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-6 py-7" style={{ borderBottom: '1px solid var(--border-light)', background: 'linear-gradient(135deg, rgba(184,150,12,0.08) 0%, transparent 100%)' }}>
        <Link href="/" className="flex items-center gap-3 group">
          <div>
            <div className="text-[10px] tracking-[2px] uppercase font-semibold" style={{ color: 'var(--pearl)' }}>Admin Console</div>
            <div className="text-[8px] tracking-[2px] uppercase mt-1" style={{ color: 'var(--accent)' }}>Dashboard</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-5 overflow-y-auto">
        <div className="text-[7px] tracking-[3px] uppercase px-2 mb-4 mt-2 font-medium" style={{ color: 'var(--mauve-dim)' }}>Menu</div>
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`admin-nav-item${isActive(item.href) ? ' active' : ''}`}
          >
            <span className="shrink-0">{item.icon}</span>
            <span className="flex-1">{item.label}</span>
            {isActive(item.href) && <span className="w-1 h-1 rounded-full bg-lavender shrink-0" />}
          </Link>
        ))}
      </nav>

      <div className="px-4 py-5" style={{ borderTop: '1px solid var(--border-light)', background: 'rgba(184,150,12,0.05)' }}>
        <Link href="/" className="flex items-center gap-2.5 px-3 py-2.5 rounded text-[9px] tracking-[2px] uppercase transition-all mb-1.5" style={{ color: 'var(--mauve-dim)' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(195,199,244,0.1)'; e.currentTarget.style.color = 'var(--accent)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--mauve-dim)'; }}>
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          View Site
        </Link>
        <button
          onClick={() => setLogoutModal(true)}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-[9px] tracking-[2px] uppercase transition-all" style={{ color: 'var(--mauve-dim)' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--mauve-dim)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <>
      <Head>
        <title>{title ? `${title} — Admin` : 'Admin — Kija Maharjan'}</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>

      <div className="admin-shell">
        {/* Desktop Sidebar */}
        <aside className="admin-sidebar-desktop">
          <SidebarContent />
        </aside>

        {/* Mobile overlay backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[140] lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar drawer */}
        <aside className={`admin-sidebar-mobile${sidebarOpen ? ' open' : ''}`}>
          <SidebarContent />
        </aside>

        {/* Main content area */}
        <div className="admin-main">
          {/* Topbar */}
          <header className="admin-topbar">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden w-9 h-9 flex items-center justify-center border border-lavender/20 hover:border-lavender/50 transition-colors"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle menu"
              >
                {sidebarOpen ? (
                  <svg className="w-4 h-4 text-lavender" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-lavender" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                  </svg>
                )}
              </button>
              {title && (
                <div>
                  <div className="text-[8px] tracking-[3px] uppercase text-lavender/50 hidden sm:block">Admin</div>
                  <h1 className="font-serif text-lg md:text-2xl font-light text-pearl leading-tight">{title}</h1>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-green-500/20 bg-green-500/5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[8px] tracking-[2px] uppercase text-green-400/70">Live</span>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="admin-page-content">
            {children}
          </main>
        </div>
      </div>

      {/* Logout Modal */}
      {logoutModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-plum-light border border-lavender/20 p-8 w-full max-w-sm">
            <div className="font-serif text-2xl text-pearl mb-2">Sign out?</div>
            <p className="text-xs text-mauve-dim mb-7 leading-relaxed tracking-wide">You will be redirected to the home page.</p>
            <div className="flex gap-3">
              <button onClick={logout} className="btn-danger flex-1 py-3 text-[10px]">Confirm</button>
              <button onClick={() => setLogoutModal(false)} className="btn-outline flex-1 py-3 text-[10px]">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}