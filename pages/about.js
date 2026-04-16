import Layout from '../components/Layout'

export default function About() {
  const stats = [
    { num: '3+', label: 'Years Experience' },
    { num: '10+', label: 'Projects Built' },
    { num: '6', label: 'Services Offered' },
    { num: '∞', label: 'Ideas to Build' },
  ]

  return (
    <Layout>
      <div className="section-padding bg-dark-2">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-5 mb-16">
            <span className="font-serif text-sm text-gold tracking-[2px]">01</span>
            <div className="w-12 h-px bg-gold/50" />
            <h1 className="font-serif text-3xl md:text-5xl font-light text-cream">
              About <em className="text-gold italic">Me</em>
            </h1>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-5">
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

            <div className="grid grid-cols-2 gap-0.5">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-dark-3 p-6 md:p-8 border-l-2 border-transparent hover:border-gold transition-all duration-300 group cursor-default"
                >
                  <div className="font-serif text-4xl md:text-5xl font-light text-gold leading-tight">{stat.num}</div>
                  <div className="text-[9px] tracking-[2px] uppercase text-text-dim mt-2 group-hover:text-text transition-colors">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
