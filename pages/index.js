import Layout from '../components/Layout'
import { useState, useEffect } from 'react'

export default function Home({ certs }) {
  const [visibleSections, setVisibleSections] = useState(new Set())
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]))
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  const isVisible = (sectionId) => visibleSections.has(sectionId)

  const stats = [
    { num: '3+', label: 'Years Experience' },
    { num: '10+', label: 'Projects Built' },
    { num: '6', label: 'Services Offered' },
    { num: '∞', label: 'Ideas to Build' },
  ]

  const services = [
    { num: '01', name: 'Website Design & Development', desc: 'End-to-end website creation — from wireframes to deployment. Responsive, fast, and visually compelling digital experiences tailored to your brand.' },
    { num: '02', name: 'POS Systems', desc: 'Custom point-of-sale solutions for restaurants and cafes. Streamline orders, track inventory, and manage your business with ease.' },
    { num: '03', name: 'Online Menu Systems', desc: 'Digital menus with QR code integration for restaurants and cafes. Beautiful, easy to update, and accessible on any device.' },
    { num: '04', name: 'Database Management', desc: 'Structured, scalable database design and management. From schema design to optimization, ensuring your data is secure and accessible.' },
    { num: '05', name: 'Web Hosting Setup', desc: 'Get your website live and running smoothly. Domain configuration, server setup, SSL certificates, and ongoing maintenance support.' },
    { num: '06', name: 'UI / UX Design', desc: 'Intuitive interfaces and seamless user experiences. Clean layouts, thoughtful interactions, and designs that users actually enjoy using.' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setToast({ message: 'Message sent successfully!', type: 'success' })
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setToast({ message: 'Failed to send. Try again.', type: 'error' })
      }
    } catch {
      setToast({ message: 'Something went wrong.', type: 'error' })
    }
    setLoading(false)
  }

  return (
    <Layout singlePage>
      {toast && (
        <div className={`toast ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}>
          {toast.message}
        </div>
      )}

      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ paddingTop: '80px' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-plum via-plum to-plum-light" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-lavender/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-lavender/3 rounded-full blur-3xl" />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center">
          <div className={`mb-12 transition-all duration-700 ${isVisible('home') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="font-serif text-8xl md:text-9xl font-light text-pearl tracking-wider">
              K<span style={{ color: 'var(--accent)' }}>M</span>
            </div>
          </div>

          <div className={`text-[9px] tracking-[5px] text-lavender uppercase mb-6 transition-all duration-700 delay-100 ${isVisible('home') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Based in Kathmandu, Nepal
          </div>

          <div className={`text-[11px] tracking-[4px] text-mauve-dim uppercase mt-5 mb-8 transition-all duration-700 delay-200 ${isVisible('home') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Fullstack Developer &nbsp;·&nbsp; UI Designer &nbsp;·&nbsp; Freelancer
          </div>

          <p className={`text-sm leading-relaxed text-text max-w-lg mx-auto mb-8 transition-all duration-700 delay-300 ${isVisible('home') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            A self-motivated developer & designer with 3+ years of experience crafting websites, POS systems, and digital experiences that are both functional and beautiful.
          </p>

          <div className={`flex flex-wrap justify-center gap-5 transition-all duration-700 delay-400 ${isVisible('home') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <a href="#projects" className="btn-primary">View My Work</a>
            <a href="#contact" className="btn-outline">Hire Me</a>
          </div>

          <div className={`flex justify-center gap-3.5 mt-8 transition-all duration-700 delay-500 ${isVisible('home') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <a href="https://github.com/Kija-Maharjan" target="_blank" rel="noreferrer" className="w-10 h-10 border border-lavender/30 flex items-center justify-center transition-all duration-300 hover:border-lavender hover:bg-lavender-dim">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--accent)' }}>
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
              </svg>
            </a>
            <a href="https://linkedin.com/in/Kija-Maharjan" target="_blank" rel="noreferrer" className="w-10 h-10 border border-lavender/30 flex items-center justify-center transition-all duration-300 hover:border-lavender hover:bg-lavender-dim">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--accent)' }}>
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 text-[9px] tracking-[3px] text-mauve-dim uppercase">
          <div className="w-8 h-px bg-lavender" />
          Scroll to explore
        </div>
      </section>

      <section id="about" className="section-padding bg-plum-light">
        <div className="max-w-7xl mx-auto">
          <div className={`mb-16 transition-all duration-700 ${isVisible('about') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center gap-5 mb-16">
              <span className="font-serif text-sm text-lavender tracking-[2px]">01</span>
              <div className="w-12 h-px bg-lavender/50" />
              <h2 className="font-serif text-3xl md:text-5xl font-light text-pearl">
                About <em className="text-lavender italic">Me</em>
              </h2>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className={`space-y-5 transition-all duration-700 delay-100 ${isVisible('about') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <p className="text-sm leading-relaxed text-text">
                I'm Kija Maharjan, a fullstack developer and designer based in Kathmandu, Nepal. With 3+ years of hands-on programming experience, I bring ideas to life through clean code and thoughtful design.
              </p>
              <p className="text-sm leading-relaxed text-text">
                My expertise spans building complete websites from scratch, developing robust POS systems for restaurants and cafes, creating interactive online menus, and handling everything from database architecture to web hosting.
              </p>
              <p className="text-sm leading-relaxed text-text">
                I believe great digital products are built at the intersection of technical precision and visual elegance — and I bring both to every project I take on.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <a href="https://github.com/Kija-Maharjan" target="_blank" rel="noreferrer" className="btn-primary text-[10px]">GitHub Profile</a>
                <a href="https://linkedin.com/in/Kija-Maharjan" target="_blank" rel="noreferrer" className="btn-outline text-[10px]">LinkedIn</a>
              </div>
            </div>

            <div className={`grid grid-cols-2 gap-0.5 transition-all duration-700 delay-200 ${isVisible('about') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-plum-lighter p-6 md:p-8 border-l-2 border-transparent hover:border-lavender transition-all duration-300 group cursor-default"
                >
                  <div className="font-serif text-4xl md:text-5xl font-light text-lavender leading-tight">{stat.num}</div>
                  <div className="text-[9px] tracking-[2px] uppercase text-mauve-dim mt-2 group-hover:text-text transition-colors">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className={`mb-12 transition-all duration-700 ${isVisible('about') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center gap-5 mb-12">
              <span className="font-serif text-sm text-lavender tracking-[2px]">Explore</span>
              <div className="w-12 h-px bg-lavender/50" />
              <h2 className="font-serif text-3xl md:text-5xl font-light text-pearl">
                Dedicated <em className="text-lavender italic">Spaces</em>
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-0.5">
            <a href="/gym" className={`group block bg-plum-light p-8 md:p-10 hover:-translate-y-1 transition-all duration-300 ${isVisible('about') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '0ms' }}>
              <div className="font-serif text-4xl text-lavender/20 font-light mb-4 group-hover:text-lavender/30 transition-colors">Gym</div>
              <h3 className="font-serif text-xl text-pearl mb-3">Fitness & Gym</h3>
              <p className="text-xs leading-relaxed text-mauve-dim group-hover:text-text transition-colors mb-6">
                Gym management platforms, workout trackers, and fitness apps built for the active life.
              </p>
              <span className="text-[9px] tracking-[2px] uppercase text-lavender group-hover:underline">Explore →</span>
            </a>

            <a href="/art" className={`group block bg-plum-light p-8 md:p-10 hover:-translate-y-1 transition-all duration-300 ${isVisible('about') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '100ms' }}>
              <div className="font-serif text-4xl text-orchid/20 font-light mb-4 group-hover:text-orchid/30 transition-colors">Art</div>
              <h3 className="font-serif text-xl text-pearl mb-3">Art & Design</h3>
              <p className="text-xs leading-relaxed text-mauve-dim group-hover:text-text transition-colors mb-6">
                Brand identity, fashion tech, and visually-driven creative digital experiences.
              </p>
              <span className="text-[9px] tracking-[2px] uppercase text-orchid group-hover:underline">Explore →</span>
            </a>

            <a href="/community" className={`group block bg-plum-light p-8 md:p-10 hover:-translate-y-1 transition-all duration-300 ${isVisible('about') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '200ms' }}>
              <div className="font-serif text-4xl text-rose/20 font-light mb-4 group-hover:text-rose/30 transition-colors">Community</div>
              <h3 className="font-serif text-xl text-pearl mb-3">Community & Food</h3>
              <p className="text-xs leading-relaxed text-mauve-dim group-hover:text-text transition-colors mb-6">
                POS systems, online menus, and platforms that bring people together through food.
              </p>
              <span className="text-[9px] tracking-[2px] uppercase text-rose group-hover:underline">Explore →</span>
            </a>
          </div>
        </div>
      </section>

      <section id="services" className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className={`mb-16 transition-all duration-700 ${isVisible('services') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center gap-5 mb-16">
              <span className="font-serif text-sm text-lavender tracking-[2px]">03</span>
              <div className="w-12 h-px bg-lavender/50" />
              <h2 className="font-serif text-3xl md:text-5xl font-light text-pearl">
                My <em className="text-lavender italic">Services</em>
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0.5">
            {services.map((service, i) => (
              <div
                key={service.num}
                className={`bg-plum-light p-8 md:p-10 relative group hover:-translate-y-1 transition-all duration-300 ${
                  isVisible('services') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="absolute top-6 right-7 font-serif text-5xl text-lavender/5 font-light leading-none group-hover:text-lavender/10 transition-colors duration-300">
                  {service.num}
                </div>
                <h3 className="font-serif text-lg text-pearl mb-3 font-normal pr-12">{service.name}</h3>
                <p className="text-xs leading-relaxed text-mauve-dim group-hover:text-text transition-colors">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="certificates" className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className={`mb-12 transition-all duration-700 ${isVisible('certificates') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center gap-5 mb-12">
              <span className="font-serif text-sm text-lavender tracking-[2px]">04</span>
              <div className="w-12 h-px bg-lavender/50" />
              <h2 className="font-serif text-3xl md:text-5xl font-light text-pearl">
                Certificates & <em className="text-lavender italic">Learning</em>
              </h2>
            </div>
          </div>

          <div className="flex flex-col gap-0.5">
            {certs.length === 0 ? (
              <div className="loader">No certificates yet</div>
            ) : certs.map((cert) => (
              <div
                key={cert.id}
                className={`bg-plum-light p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-l-2 border-transparent hover:border-lavender hover:pl-10 transition-all duration-300 group cursor-default ${
                  isVisible('certificates') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                }`}
              >
                <div>
                  <h3 className="font-serif text-lg text-pearl font-normal">{cert.name}</h3>
                  <div className="text-[10px] tracking-[2px] uppercase text-mauve-dim mt-1">{cert.issuer}</div>
                  {cert.date && <div className="text-[10px] text-mauve-dim mt-1">{cert.date}</div>}
                </div>
                <div className="flex flex-col items-start md:items-end gap-2">
                  <span className={`badge ${cert.status === 'In Progress' ? '' : 'badge-green'}`}>
                    {cert.status || 'Completed'}
                  </span>
                  {cert.url && (
                    <a href={cert.url} target="_blank" rel="noreferrer" className="text-[9px] tracking-[1px] text-lavender uppercase group-hover:underline">
                      View →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="section-padding bg-plum-light">
        <div className="max-w-7xl mx-auto text-center">
          <div className={`mb-12 transition-all duration-700 ${isVisible('contact') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center justify-center gap-5 mb-12">
              <span className="font-serif text-sm text-lavender tracking-[2px]">06</span>
              <div className="w-12 h-px bg-lavender/50" />
              <h2 className="font-serif text-3xl md:text-5xl font-light text-pearl">
                Get In <em className="text-lavender italic">Touch</em>
              </h2>
            </div>

            <p className="font-serif text-2xl md:text-4xl font-light text-pearl max-w-xl mx-auto leading-snug mb-14">
              Have a project in mind? Let us build something <em className="text-lavender italic">remarkable</em> together.
            </p>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-0.5 max-w-2xl mx-auto mb-14 transition-all duration-700 delay-100 ${isVisible('contact') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <a href="mailto:maharjankija@gmail.com" className="bg-plum-lighter p-6 md:p-8 flex flex-col items-center gap-3 hover:bg-plum transition-colors">
              <div className="text-[8px] tracking-[2px] uppercase text-mauve-dim">Email</div>
              <div className="text-[11px] text-pearl break-all">maharjankija@gmail.com</div>
            </a>
            <a href="tel:+9779761722461" className="bg-plum-lighter p-6 md:p-8 flex flex-col items-center gap-3 hover:bg-plum transition-colors">
              <div className="text-[8px] tracking-[2px] uppercase text-mauve-dim">Phone</div>
              <div className="text-[11px] text-pearl">+977 9761722461</div>
            </a>
            <div className="bg-plum-lighter p-6 md:p-8 flex flex-col items-center gap-3">
              <div className="text-[8px] tracking-[2px] uppercase text-mauve-dim">Location</div>
              <div className="text-[11px] text-pearl">Kathmandu, Nepal</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={`max-w-xl mx-auto flex flex-col gap-0.5 transition-all duration-700 delay-200 ${isVisible('contact') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="form-row">
              <input
                className="form-input"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                className="form-input"
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <input
              className="form-input"
              placeholder="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />
            <textarea
              className="form-textarea"
              placeholder="Tell me about your project..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />
            <button type="submit" className="btn-primary mt-0.5 py-4 tracking-[4px]" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>

      <footer className="bg-plum border-t border-lavender/10 py-6 md:py-8 px-5 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-serif text-base text-pearl">
            K<span className="text-lavender">M</span>
          </div>
          <div className="text-[10px] tracking-[2px] text-mauve-dim uppercase">
            © 2025 Kija Maharjan
          </div>
          <div className="flex gap-3">
            <a href="https://github.com/Kija-Maharjan" target="_blank" rel="noreferrer" className="w-8 h-8 border border-lavender/20 flex items-center justify-center transition-all duration-300 hover:border-lavender hover:bg-lavender-dim" title="GitHub">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-lavender fill-none stroke-[1.5]">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
              </svg>
            </a>
            <a href="https://linkedin.com/in/Kija-Maharjan" target="_blank" rel="noreferrer" className="w-8 h-8 border border-lavender/20 flex items-center justify-center transition-all duration-300 hover:border-lavender hover:bg-lavender-dim" title="LinkedIn">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-lavender fill-none stroke-[1.5]">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            <a href="https://instagram.com/kijamaharjan" target="_blank" rel="noreferrer" className="w-8 h-8 border border-lavender/20 flex items-center justify-center transition-all duration-300 hover:border-lavender hover:bg-lavender-dim" title="Instagram">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-lavender fill-none stroke-[1.5]">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </Layout>
  )
}

export async function getServerSideProps() {
  const { supabase } = await import('../lib/supabase')

  const { data: certs } = await supabase
    .from('certificates')
    .select('*')
    .order('created_at', { ascending: false })

  return {
    props: {
      certs: certs || [],
    },
  }
}
