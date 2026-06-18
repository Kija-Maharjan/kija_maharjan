import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'

export default function Messages({ messages }) {
  const [expanded, setExpanded] = useState(null)

  return (
    <AdminLayout title="Messages">
      {messages.length === 0 ? (
        <div className="text-center py-16 text-xs" style={{ color: 'var(--mauve-dim)' }}>No messages yet</div>
      ) : (
        <div className="flex flex-col gap-0.5">
          {messages.map(msg => (
            <div key={msg.id} style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-light)', border: '1px solid' }}>
              <div
                className="p-5 md:p-6 flex items-center justify-between cursor-pointer transition-colors"
                style={{ color: 'var(--mauve)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(184,150,12,0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
              >
                <div>
                  <div className="font-serif text-lg" style={{ color: 'var(--pearl)' }}>{msg.name}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--mauve-dim)' }}>{msg.email} · {msg.subject}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-[9px]" style={{ color: 'var(--mauve-dim)' }}>{new Date(msg.created_at).toLocaleDateString()}</div>
                  <div className="text-sm" style={{ color: 'var(--accent)' }}>{expanded === msg.id ? '▲' : '▼'}</div>
                </div>
              </div>
              {expanded === msg.id && (
                <div className="px-5 md:px-6 pb-6" style={{ borderTop: '1px solid var(--border-light)' }}>
                  <p className="text-sm leading-relaxed mt-4" style={{ color: 'var(--mauve)' }}>{msg.message}</p>
                  <a href={`mailto:${msg.email}`} className="btn-outline text-[10px] px-5 py-2.5 inline-block mt-4">
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

export async function getServerSideProps({ req }) {
  const { isAdmin } = await import('../../lib/auth')
  if (!isAdmin(req)) return { redirect: { destination: '/admin/login', permanent: false } }
  const { supabaseAdmin } = await import('../../lib/supabase')
  const { data: messages } = await supabaseAdmin.from('messages').select('*').order('created_at', { ascending: false })
  return { props: { messages: messages || [] } }
}
