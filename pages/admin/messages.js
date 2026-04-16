import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'

export default function Messages({ messages }) {
  const [expanded, setExpanded] = useState(null)

  return (
    <AdminLayout title="Messages">
      {messages.length === 0 ? (
        <div className="text-center py-16 text-text-dim text-xs">No messages yet</div>
      ) : (
        <div className="flex flex-col gap-0.5">
          {messages.map(msg => (
            <div key={msg.id} className="bg-dark-2 border border-gold/5 overflow-hidden">
              <div
                className="p-5 md:p-6 flex items-center justify-between cursor-pointer hover:bg-dark-3/50 transition-colors"
                onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
              >
                <div>
                  <div className="font-serif text-lg text-cream">{msg.name}</div>
                  <div className="text-xs text-text-dim mt-1">{msg.email} · {msg.subject}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-[9px] text-text-dim">{new Date(msg.created_at).toLocaleDateString()}</div>
                  <div className="text-gold text-sm">{expanded === msg.id ? '▲' : '▼'}</div>
                </div>
              </div>
              {expanded === msg.id && (
                <div className="px-5 md:px-6 pb-6 border-t border-gold/10">
                  <p className="text-sm leading-relaxed text-text mt-4">{msg.message}</p>
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
  const { supabase } = await import('../../lib/supabase')
  const { data: messages } = await supabase.from('messages').select('*').order('created_at', { ascending: false })
  return { props: { messages: messages || [] } }
}
