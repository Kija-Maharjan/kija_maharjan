import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Layout({ children, singlePage = false }) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 })
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 })
  const [scrolled, setScrolled] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  useEffect(() => {
    if (isTouchDevice) return

    let animFrame
    let target = { x: -100, y: -100 }
    let current = { x: -100, y: -100 }

    const onMove = (e) => {
      target.x = e.clientX
      target.y = e.clientY
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    const animate = () => {
      current.x += (target.x - current.x) * 0.15
      current.y += (target.y - current.y) * 0.15
      setRingPos({ x: current.x, y: current.y })
      animFrame = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    animFrame = requestAnimationFrame(animate)
    
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (animFrame) cancelAnimationFrame(animFrame)
    }
  }, [isTouchDevice])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'auto'
    return () => { document.body.style.overflow = 'auto' }
  }, [menuOpen])

  const navLinks = [
    { href: '/', label: 'Home', section: 'home' },
    { href: '/#about', label: 'About', section: 'about' },
    { href: '/#services', label: 'Services', section: 'services' },
    { href: '/#projects', label: 'Projects', section: 'projects' },
    { href: '/#certificates', label: 'Certificates', section: 'certificates' },
    { href: '/#contact', label: 'Contact', section: 'contact' },
  ]

  const scrollToSection = (e, sectionId) => {
    e.preventDefault()
    setMenuOpen(false)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Kija Maharjan</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {!isTouchDevice && (
        <>
          <div 
            className="cursor-dot"
            style={{ left: mousePos.x, top: mousePos.y }}
          />
          <div 
            className="cursor-ring"
            style={{ left: ringPos.x, top: ringPos.y }}
          />
        </>
      )}

      <nav className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300 h-16 md:h-20 bg-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 flex items-center justify-between h-full">
          <Link href="/" className="font-serif text-xl md:text-2xl font-semibold text-cream tracking-wider flex items-center gap-2">
            <svg className="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>K<span className="text-gold">M</span></span>
          </Link>

          <ul className="hidden lg:flex items-center gap-6 list-none m-0">
            {navLinks.map(link => (
              <li key={link.href}>
                {singlePage ? (
                  <a
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.section)}
                    className="text-[9px] tracking-[2px] uppercase font-medium text-text-dim hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="text-[9px] tracking-[2px] uppercase font-medium text-text-dim hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <Link
            href="/admin/login"
            className="hidden lg:block text-[9px] tracking-[2px] uppercase font-medium text-text-dim hover:text-gold transition-colors duration-300 border border-gold/20 hover:border-gold/40 px-4 py-2"
          >
            Login
          </Link>

          <button
            className="lg:hidden flex flex-col gap-1.5 bg-transparent border-none cursor-pointer p-1 z-[200]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-cream transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-cream transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-cream transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 bg-dark/90 backdrop-blur-md z-[150] flex flex-col items-center justify-center gap-8 lg:hidden">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                if (singlePage) {
                  scrollToSection(e, link.section)
                } else {
                  setMenuOpen(false)
                }
              }}
              className="text-cream text-sm tracking-[4px] uppercase font-light hover:text-gold transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Link href="/admin/login" onClick={() => setMenuOpen(false)} className="text-gold text-xs tracking-[3px] uppercase mt-4 hover:text-gold-light">
            Admin Login
          </Link>
        </div>
      )}

      <main className="flex-1 pb-0">
        {children}
      </main>
    </div>
  )
}