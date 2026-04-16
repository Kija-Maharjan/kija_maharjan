import { useState } from 'react'
import Link from 'next/link'

export default function AdminLayout({ children, title }) {
  const [logoutModal, setLogoutModal] = useState(false)
  
  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.href = '/admin/login'
  }

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    )},
    { href: '/admin/projects', label: 'Projects', icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
      </svg>
    )},
    { href: '/admin/github', label: 'GitHub Sync', icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
      </svg>
    )},
    { href: '/admin/github-repos', label: 'GitHub Repos', icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
      </svg>
    )},
    { href: '/admin/certificates', label: 'Certificates', icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </svg>
    )},
    { href: '/admin/messages', label: 'Messages', icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    )},
  ]

  return (
    <div className="admin-layout bg-dark">
      <aside className="admin-sidebar">
        <div className="pb-8 mb-6 border-b border-gold/10">
          <Link href="/" className="font-serif text-2xl text-cream no-underline">
            K<span className="text-gold">M</span>
          </Link>
          <div className="text-[8px] tracking-[3px] uppercase text-text-dim mt-1">Admin Panel</div>
        </div>

        <nav className="flex-1">
          {navItems.map(item => (
            <Link key={item.href} href={item.href} className={`admin-nav-link ${typeof window !== 'undefined' && window.location.pathname === item.href ? 'active' : ''}`}>
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="pt-6 border-t border-gold/10">
          <Link href="/" className="block text-[9px] tracking-[2px] uppercase text-text-dim no-underline mb-3 hover:text-gold transition-colors">
            ← View Site
          </Link>
          <button onClick={logout} className="w-full bg-transparent border border-gold/20 text-text-dim py-2 px-4 text-[9px] tracking-[2px] uppercase cursor-pointer font-sans hover:border-gold hover:text-gold transition-all">
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-content">
        {title && (
          <div className="mb-10 pb-6 border-b border-gold/10">
            <h1 className="font-serif text-3xl font-light text-cream">{title}</h1>
          </div>
        )}
        {children}
      </main>
    </div>
  )
}
