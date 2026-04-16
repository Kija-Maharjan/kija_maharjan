import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminLayout from '../../components/AdminLayout'

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, certs: 0, messages: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
  }, [])

  const cards = [
    { label: 'Total Projects', value: stats.projects, href: '/admin/projects', color: 'text-gold', bg: 'bg-gold-dim' },
    { label: 'Certificates', value: stats.certs, href: '/admin/certificates', color: 'text-green-400', bg: 'bg-green-900/20' },
    { label: 'Messages', value: stats.messages, href: '/admin/messages', color: 'text-text-dim', bg: 'bg-dark-3' },
  ]

  const quickActions = [
    { href: '/admin/projects/new', label: '+ Add Project', primary: true },
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
            className={`${card.bg} p-8 border border-gold/10 text-decoration-none block transition-all duration-300 hover:border-gold/30 hover:-translate-y-0.5`}
          >
            <div className={`font-serif text-5xl ${card.color} font-light leading-none mb-2`}>
              {loading ? '...' : card.value}
            </div>
            <div className="text-[9px] tracking-[2px] uppercase text-text-dim">{card.label}</div>
          </Link>
        ))}
      </div>

      <div className="bg-dark-2 p-8 border border-gold/10">
        <div className="text-[9px] tracking-[3px] uppercase text-gold mb-6">Quick Actions</div>
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

      <div className="mt-8 bg-dark-2 p-8 border border-gold/10">
        <div className="text-[9px] tracking-[3px] uppercase text-gold mb-6">Recent Activity</div>
        <div className="text-sm text-text-dim text-center py-8">
          No recent activity. Start by adding a project or syncing your GitHub repos.
        </div>
      </div>
    </AdminLayout>
  )
}
