import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Layout({ children }) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [ringPos, setRingPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let animFrame
    let target = { x: 0, y: 0 }
    let current = { x: 0, y: 0 }

    const onMove = (e) => {
      target.x = e.clientX
      target.y = e.clientY
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    const animate = () => {
      current.x += (target.x - current.x) * 0.12
      current.y += (target.y - current.y) * 0.12
      setRingPos({ x: current.x, y: current.y })
      animFrame = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    animFrame = requestAnimationFrame(animate)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(animFrame)
    }
  }, [])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/projects', label: 'Projects' },
    { href: '/certificates', label: 'Certificates' },
    { href: '/contact', label: 'Contact' },
  ]

  const isActive = (href) => {
    if (href === '/') return router.pathname === '/'
    return router.pathname.startsWith(href)
  }

  return (
    <>
      {/* Custom Cursor */}
      <div className="cursor" style={{ left: mousePos.x, top: mousePos.y }} />
      <div className="cursor-ring" style={{ left: ringPos.x, top: ringPos.y }} />

      {/* Nav */}
      <nav>
        <Link href="/" className="nav-logo">K<span>M</span></Link>
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={isActive(link.href) ? 'active' : ''}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Page Content */}
      <main className="page-wrapper">
        {children}
      </main>

      {/* Footer */}
      <footer>
        <div className="footer-logo">K<span>M</span></div>
        <div className="footer-copy">© 2025 Kija Maharjan · kijamaharjan.xyz</div>
        <div className="footer-socials">
          <a href="https://github.com/Kija-Maharjan" target="_blank" rel="noreferrer" className="footer-social" title="GitHub">
            <svg viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
          </a>
          <a href="https://linkedin.com/in/Kija-Maharjan" target="_blank" rel="noreferrer" className="footer-social" title="LinkedIn">
            <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
          </a>
          <a href="https://instagram.com/kijamaharjan" target="_blank" rel="noreferrer" className="footer-social" title="Instagram">
            <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          </a>
        </div>
      </footer>
    </>
  )
}
