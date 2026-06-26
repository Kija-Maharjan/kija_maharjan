import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useTheme } from '../hooks/useTheme'
import { useVisitorAuth } from '../hooks/useVisitorAuth'

export default function Layout({ children, singlePage = false }) {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const { user, loading: authLoading, logout } = useVisitorAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 })
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 })
  const [scrolled, setScrolled] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    setMounted(true)
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
    { href: '/gym', label: 'Gym', section: null },
    { href: '/art', label: 'Art', section: null },
    { href: '/community', label: 'Community', section: null },
    { href: '/#services', label: 'Services', section: 'services' },
    { href: '/projects', label: 'Projects', section: null },
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

      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 bg-plum/40 backdrop-blur-xl border border-white/10 rounded-lg px-6 py-3 flex items-center gap-8">
        {/* KM Logo */}
        <Link href="/" className="font-serif text-2xl font-semibold text-pearl tracking-wider hover:opacity-80 transition-opacity flex-shrink-0">
          K<span style={{ color: 'var(--accent)' }}>M</span>
        </Link>

        <div className="flex items-center justify-center h-full">
          <ul className="hidden lg:flex items-center gap-6 list-none m-0">
            {navLinks.map(link => (
              <li key={link.href}>
                {singlePage && link.section ? (
                  <a
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.section)}
                    className="text-[9px] tracking-[2px] uppercase font-medium text-mauve-dim hover:text-lavender transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="text-[9px] tracking-[2px] uppercase font-medium text-mauve-dim hover:text-lavender transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {user ? (
            <div className="hidden lg:flex items-center gap-3">
              <span className="text-[9px] tracking-[2px] uppercase text-lavender">{user.username}</span>
              <button
                onClick={async () => { await logout(); window.location.href = '/' }}
                className="text-[9px] tracking-[2px] uppercase font-medium text-mauve-dim hover:text-lavender transition-colors duration-300 border border-lavender/20 hover:border-lavender/40 px-4 py-2"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden lg:block text-[9px] tracking-[2px] uppercase font-medium text-mauve-dim hover:text-lavender transition-colors duration-300 border border-lavender/20 hover:border-lavender/40 px-4 py-2 ml-6"
            >
              Login
            </Link>
          )}

          <button
            className="lg:hidden flex flex-col gap-1.5 bg-transparent border-none cursor-pointer p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-pearl transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-pearl transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-pearl transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 bg-plum/90 backdrop-blur-md z-[150] flex flex-col items-center justify-center gap-8 lg:hidden">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                if (singlePage && link.section) {
                  scrollToSection(e, link.section)
                } else {
                  setMenuOpen(false)
                }
              }}
              className="text-pearl text-sm tracking-[4px] uppercase font-light hover:text-lavender transition-colors"
            >
              {link.label}
            </a>
          ))}
          {user ? (
            <button
              onClick={async () => { await logout(); window.location.href = '/' }}
              className="text-lavender text-xs tracking-[3px] uppercase mt-4"
            >
              Logout {user.username}
            </button>
          ) : (
            <Link href="/login" onClick={() => setMenuOpen(false)} className="text-lavender text-xs tracking-[3px] uppercase mt-4 hover:text-lavender-light">
              Login
            </Link>
          )}
          <Link href="/admin/login" onClick={() => setMenuOpen(false)} className="text-mauve-dim text-[9px] tracking-[2px] uppercase mt-2 hover:text-pearl">
            Admin Login
          </Link>
          {mounted && (
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-lavender/10 transition-colors duration-300 mt-4"
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5 text-lavender" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-lavender" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </button>
          )}
        </div>
      )}

      <main className="flex-1 pb-0">
        {children}
      </main>
    </div>
  )
}