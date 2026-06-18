import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminLayout from '../../components/AdminLayout'
import { useAdminAuth } from '../../hooks/useAdminAuth'

export default function Dashboard() {
  const { isAuthenticated, loading: authLoading } = useAdminAuth()
  const [stats, setStats] = useState({ projects: 0, certs: 0, messages: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) return

    Promise.all([
      fetch('/api/projects').then(r => r.json()).catch(() => []),
      fetch('/api/certificates').then(r => r.json()).catch(() => []),
    ]).then(([projects, certs]) => {
      setStats({
        projects: Array.isArray(projects) ? projects.length : 0,
        certs: Array.isArray(certs) ? certs.length : 0,
        messages: 0
      })
      setLoading(false)
    })
  }, [authLoading, isAuthenticated])

  const cards = [
    { label: 'Total Projects', value: stats.projects, href: '/admin/projects', bgStyle: 'rgba(195,199,244,0.1)', textColor: 'var(--accent)' },
    { label: 'Certificates', value: stats.certs, href: '/admin/certificates', bgStyle: 'rgba(76,175,80,0.1)', textColor: '#4caf50' },
    { label: 'Messages', value: stats.messages, href: '/admin/messages', bgStyle: 'rgba(156,39,176,0.1)', textColor: '#9c27b0' },
  ]

  const quickActions = [
    { href: '/admin/projects/new', label: '+ Add Project', primary: true },
    { href: '/admin/settings', label: '⚙ Settings', primary: false },
    { href: '/admin/github', label: '⟳ Sync GitHub', primary: false },
    { href: '/admin/certificates/new', label: '+ Add Certificate', primary: false },
    { href: '/admin/messages', label: 'View Messages', primary: false },
  ]

  return (
    <AdminLayout title="Dashboard">
      <div className="grid md:grid-cols-3 gap-4 mb-12">
        {cards.map((card, i) => (
          <Link
            key={i}
            href={card.href}
            className="p-8 border transition-all duration-300 hover:-translate-y-0.5"
            style={{
              backgroundColor: card.bgStyle,
              borderColor: 'var(--border-light)',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-strong)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-light)';
            }}
          >
            <div className="font-serif text-5xl font-light leading-none mb-2" style={{ color: card.textColor }}>
              {loading ? '...' : card.value}
            </div>
            <div className="text-[9px] tracking-[2px] uppercase" style={{ color: 'var(--mauve-dim)' }}>{card.label}</div>
          </Link>
        ))}
      </div>

      <div className="p-8 border transition-all" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}>
        <div className="text-[9px] tracking-[3px] uppercase mb-6" style={{ color: 'var(--accent)' }}>Quick Actions</div>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action, i) => (
            <Link
              key={i}
              href={action.href}
              className={action.primary ? 'btn-primary text-[10px] px-6 py-2.5' : 'btn-outline text-[10px] px-6 py-2.5'}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 p-8 border transition-all" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}>
        <div className="text-[9px] tracking-[3px] uppercase mb-6" style={{ color: 'var(--accent)' }}>Recent Activity</div>
        <div className="text-sm text-center py-8" style={{ color: 'var(--mauve-dim)' }}>
          No recent activity. Start by adding a project or syncing your GitHub repos.
        </div>
      </div>
    </AdminLayout>
  )
}
