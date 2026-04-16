import { supabase } from '../lib/supabase'
import Layout from '../components/Layout'

export async function getServerSideProps() {
  const { data: certs } = await supabase
    .from('certificates')
    .select('*')
    .order('created_at', { ascending: false })
  return { props: { certs: certs || [] } }
}

export default function Certificates({ certs }) {
  return (
    <Layout>
      <div className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-5 mb-12">
            <span className="font-serif text-sm text-gold tracking-[2px]">04</span>
            <div className="w-12 h-px bg-gold/50" />
            <h1 className="font-serif text-3xl md:text-5xl font-light text-cream">
              Certificates & <em className="text-gold italic">Learning</em>
            </h1>
          </div>

          <div className="flex flex-col gap-0.5">
            {certs.length === 0 ? (
              <div className="loader">No certificates yet</div>
            ) : certs.map(cert => (
              <div
                key={cert.id}
                className="bg-dark-2 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-l-2 border-transparent hover:border-gold hover:pl-10 transition-all duration-300 group cursor-default"
              >
                <div>
                  <h3 className="font-serif text-lg text-cream font-normal">{cert.name}</h3>
                  <div className="text-[10px] tracking-[2px] uppercase text-text-dim mt-1">{cert.issuer}</div>
                  {cert.date && <div className="text-[10px] text-text-dim mt-1">{cert.date}</div>}
                </div>
                <div className="flex flex-col items-start md:items-end gap-2">
                  <span className={`badge ${cert.status === 'In Progress' ? '' : 'badge-green'}`}>
                    {cert.status || 'Completed'}
                  </span>
                  {cert.url && (
                    <a href={cert.url} target="_blank" rel="noreferrer" className="text-[9px] tracking-[1px] text-gold uppercase group-hover:underline">
                      View →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
