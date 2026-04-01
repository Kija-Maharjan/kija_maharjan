import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { supabase } from '../../lib/supabase'

export async function getServerSideProps({ req }) {
  const { isAdmin } = await import('../../lib/auth')
  if (!isAdmin(req)) return { redirect: { destination: '/admin/login', permanent: false } }
  const { data: messages } = await supabase.from('messages').select('*').order('created_at', { ascending: false })
  return { props: { messages: messages || [], adminPage: true } }
}

export default function Messages({ messages }) {
  const [expanded, setExpanded] = useState(null)

  return (
    <AdminLayout title="Messages">
      {messages.length === 0 ? (
        <div className="loader">No messages yet</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ background: 'var(--dark2)', border: '1px solid rgba(184,150,12,0.05)', overflow: 'hidden' }}>
              <div
                style={{ padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
              >
                <div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', color: 'var(--cream)' }}>{msg.name}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '4px' }}>{msg.email} · {msg.subject}</div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ fontSize: '9px', color: 'var(--text-dim)' }}>{new Date(msg.created_at).toLocaleDateString()}</div>
                  <div style={{ color: 'var(--gold)', fontSize: '12px' }}>{expanded === msg.id ? '▲' : '▼'}</div>
                </div>
              </div>
              {expanded === msg.id && (
                <div style={{ padding: '0 28px 24px', borderTop: '1px solid rgba(184,150,12,0.08)' }}>
                  <p style={{ fontSize: '13px', lineHeight: 1.8, color: 'var(--text)', marginTop: '16px' }}>{msg.message}</p>
                  <a href={`mailto:${msg.email}`} className="btn-outline" style={{ display: 'inline-block', marginTop: '16px', padding: '8px 20px', fontSize: '9px' }}>
                    Reply →
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
