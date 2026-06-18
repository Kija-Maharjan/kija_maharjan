import Layout from '../components/Layout'

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
    <Layout>
      <div className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-5 mb-16">
            <span className="font-serif text-sm text-lavender tracking-[2px]">02</span>
            <div className="w-12 h-px bg-lavender/50" />
            <h1 className="font-serif text-3xl md:text-5xl font-light text-pearl">
              My <em className="text-lavender italic">Services</em>
            </h1>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0.5">
            {services.map((service) => (
              <div
                key={service.num}
                className="bg-plum-light p-8 md:p-10 relative group hover:-translate-y-1 transition-all duration-300"
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
      </div>
    </Layout>
  )
}
