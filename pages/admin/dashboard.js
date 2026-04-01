import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '../../components/AdminLayout'
import Link from 'next/link'

export default function Dashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({ projects: 0, certs: 0, messages: 0 })

  useEffect(() => {
    Promise.all([
      fetch('/api/projects').then(r => r.json()),
      fetch('/api/certificates').then(r => r.json()),
    ]).then(([projects, certs]) => {
      setStats(s => ({ ...s, projects: projects.length || 0, certs: certs.length || 0 }))
    }).catch(() => {})
  }, [])

  const cards = [
    { label: 'Total Projects', value: stats.projects, href: '/admin/projects', color: 'var(--gold)' },
    { label: 'Certificates', value: stats.certs, href: '/admin/certificates', color: '#a8e6a8' },
    { label: 'Quick Actions', value: '→', href: '/admin/projects', color: 'var(--text-dim)' },
  ]

  return (
    <AdminLayout title="Dashboard">
      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '48px' }}>
        {cards.map((card, i) => (
          <Link key={i} href={card.href} style={{ background: 'var(--dark2)', padding: '32px', border: '1px solid rgba(184,150,12,0.1)', textDecoration: 'none', transition: 'border-color 0.3s', display: 'block' }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '48px', color: card.color, fontWeight: 300, lineHeight: 1 }}>{card.value}</div>
            <div style={{ fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-dim)', marginTop: '8px' }}>{card.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div style={{ background: 'var(--dark2)', padding: '32px', border: '1px solid rgba(184,150,12,0.1)' }}>
        <div style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '24px' }}>Quick Actions</div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/admin/projects/new" className="btn-primary" style={{ padding: '10px 24px', fontSize: '9px' }}>+ Add Project</Link>
          <Link href="/admin/github" className="btn-outline" style={{ padding: '10px 24px', fontSize: '9px' }}>⟳ Sync GitHub</Link>
          <Link href="/admin/certificates/new" className="btn-outline" style={{ padding: '10px 24px', fontSize: '9px' }}>+ Add Certificate</Link>
          <Link href="/admin/messages" className="btn-outline" style={{ padding: '10px 24px', fontSize: '9px' }}>View Messages</Link>
        </div>
      </div>
    </AdminLayout>
  )
}

Dashboard.getInitialProps = () => ({ adminPage: true })
