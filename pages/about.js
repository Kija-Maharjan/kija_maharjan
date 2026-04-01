export default function About() {
  const stats = [
    { num: '3+', label: 'Years Experience' },
    { num: '10+', label: 'Projects Built' },
    { num: '6', label: 'Services Offered' },
    { num: '∞', label: 'Ideas to Build' },
  ]

  return (
    <div className="section section-alt">
      <div className="section-header">
        <span className="section-num">01</span>
        <div className="section-line" />
        <h1 className="section-title">About <em>Me</em></h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: '15px', lineHeight: 1.9, color: 'var(--text)', marginBottom: '20px' }}>
            I'm Kija Maharjan, a fullstack developer and designer based in Kathmandu, Nepal. With 3+ years of hands-on programming experience, I bring ideas to life through clean code and thoughtful design.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.9, color: 'var(--text)', marginBottom: '20px' }}>
            My expertise spans building complete websites from scratch, developing robust POS systems for restaurants and cafes, creating interactive online menus, and handling everything from database architecture to web hosting.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.9, color: 'var(--text)' }}>
            I believe great digital products are built at the intersection of technical precision and visual elegance — and I bring both to every project I take on.
          </p>

          <div style={{ display: 'flex', gap: '16px', marginTop: '36px', flexWrap: 'wrap' }}>
            <a href="https://github.com/Kija-Maharjan" target="_blank" rel="noreferrer" className="btn-primary">GitHub Profile</a>
            <a href="https://linkedin.com/in/Kija-Maharjan" target="_blank" rel="noreferrer" className="btn-outline">LinkedIn</a>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
          {stats.map((s, i) => (
            <div key={i} className="stat-box" style={{ background: 'var(--dark3)', padding: '32px 28px', borderLeft: '2px solid transparent', transition: 'border-color 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
            >
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '48px', fontWeight: 300, color: 'var(--gold)', lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-dim)', marginTop: '8px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
