const services = [
  { num: '01', name: 'Website Design & Development', desc: 'End-to-end website creation — from wireframes to deployment. Responsive, fast, and visually compelling digital experiences tailored to your brand.' },
  { num: '02', name: 'POS Systems', desc: 'Custom point-of-sale solutions for restaurants and cafes. Streamline orders, track inventory, and manage your business with ease.' },
  { num: '03', name: 'Online Menu Systems', desc: 'Digital menus with QR code integration for restaurants and cafes. Beautiful, easy to update, and accessible on any device.' },
  { num: '04', name: 'Database Management', desc: 'Structured, scalable database design and management. From schema design to optimization, ensuring your data is secure and accessible.' },
  { num: '05', name: 'Web Hosting Setup', desc: 'Get your website live and running smoothly. Domain configuration, server setup, SSL certificates, and ongoing maintenance support.' },
  { num: '06', name: 'UI / UX Design', desc: 'Intuitive interfaces and seamless user experiences. Clean layouts, thoughtful interactions, and designs that users actually enjoy using.' },
]

export default function Services() {
  return (
    <div className="section">
      <div className="section-header">
        <span className="section-num">02</span>
        <div className="section-line" />
        <h1 className="section-title">My <em>Services</em></h1>
      </div>

      <div className="grid-3">
        {services.map((s) => (
          <div key={s.num} className="service-card" style={{ background: 'var(--dark2)', padding: '48px 36px', position: 'relative', transition: 'transform 0.3s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ position: 'absolute', top: '24px', right: '28px', fontFamily: 'Cormorant Garamond, serif', fontSize: '56px', color: 'rgba(184,150,12,0.06)', fontWeight: 300, lineHeight: 1 }}>{s.num}</div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', color: 'var(--cream)', marginBottom: '12px', fontWeight: 400 }}>{s.name}</div>
            <div style={{ fontSize: '12px', lineHeight: 1.8, color: 'var(--text-dim)' }}>{s.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
