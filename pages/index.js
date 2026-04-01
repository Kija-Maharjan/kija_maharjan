import Link from 'next/link'
import { useEffect, useRef } from 'react'

export default function Home() {
  return (
    <section className="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '0 60px', position: 'relative', overflow: 'hidden' }}>
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 80% 50%, rgba(184,150,12,0.06) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 20% 80%, rgba(184,150,12,0.04) 0%, transparent 60%)' }} />
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: '65%', width: '1px', background: 'linear-gradient(180deg, transparent, rgba(184,150,12,0.3), transparent)' }} />

      {/* Big number */}
      <div style={{ position: 'absolute', right: '60px', top: '50%', transform: 'translateY(-50%)', fontFamily: 'Cormorant Garamond, serif', fontSize: '180px', fontWeight: 300, color: 'rgba(184,150,12,0.04)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>KM</div>

      <div style={{ position: 'relative', zIndex: 2, maxWidth: '700px' }}>
        <div style={{ fontSize: '9px', letterSpacing: '5px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '24px' }}>
          Based in Kathmandu, Nepal
        </div>

        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(56px, 8vw, 96px)', fontWeight: 300, color: 'var(--cream)', lineHeight: 1, letterSpacing: '-1px' }}>
          Kija<br /><em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Maharjan</em>
        </h1>

        <div style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--text-dim)', marginTop: '20px' }}>
          Fullstack Developer &nbsp;·&nbsp; UI Designer &nbsp;·&nbsp; Freelancer
        </div>

        <p style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--text)', marginTop: '32px', maxWidth: '480px' }}>
          A self-motivated developer & designer with 3+ years of experience crafting websites, POS systems, and digital experiences that are both functional and beautiful.
        </p>

        <div style={{ display: 'flex', gap: '20px', marginTop: '48px', flexWrap: 'wrap' }}>
          <Link href="/projects" className="btn-primary">View My Work</Link>
          <Link href="/contact" className="btn-outline">Hire Me</Link>
        </div>

        <div style={{ display: 'flex', gap: '14px', marginTop: '36px' }}>
          <a href="https://github.com/Kija-Maharjan" target="_blank" rel="noreferrer" style={{ width: '42px', height: '42px', border: '1px solid rgba(184,150,12,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
          </a>
          <a href="https://linkedin.com/in/Kija-Maharjan" target="_blank" rel="noreferrer" style={{ width: '42px', height: '42px', border: '1px solid rgba(184,150,12,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
          </a>
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{ position: 'absolute', bottom: '40px', left: '60px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
        <div style={{ width: '40px', height: '1px', background: 'var(--gold)' }} />
        Scroll to explore
      </div>
    </section>
  )
}
