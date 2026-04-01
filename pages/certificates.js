import { supabase } from '../lib/supabase'

export async function getServerSideProps() {
  const { data: certs } = await supabase
    .from('certificates')
    .select('*')
    .order('created_at', { ascending: false })
  return { props: { certs: certs || [] } }
}

export default function Certificates({ certs }) {
  return (
    <div className="section section-alt">
      <div className="section-header">
        <span className="section-num">04</span>
        <div className="section-line" />
        <h1 className="section-title">Certificates & <em>Learning</em></h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {certs.length === 0 ? (
          <div className="loader">No certificates yet</div>
        ) : certs.map(cert => (
          <div key={cert.id} className="cert-item" style={{ background: 'var(--dark2)', padding: '28px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s', borderLeft: '2px solid transparent' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.paddingLeft = '44px' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.paddingLeft = '36px' }}
          >
            <div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', color: 'var(--cream)', fontWeight: 400 }}>{cert.name}</div>
              <div style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-dim)', marginTop: '4px' }}>{cert.issuer}</div>
              {cert.date && <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '4px' }}>{cert.date}</div>}
            </div>
            <div>
              <span className={`badge ${cert.status === 'In Progress' ? '' : 'badge-green'}`}>{cert.status || 'Completed'}</span>
              {cert.url && (
                <a href={cert.url} target="_blank" rel="noreferrer" style={{ display: 'block', marginTop: '8px', fontSize: '9px', letterSpacing: '1px', color: 'var(--gold)', textTransform: 'uppercase' }}>View →</a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
