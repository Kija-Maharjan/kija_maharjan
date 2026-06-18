import { supabase } from '../lib/supabase'
import Layout from '../components/Layout'

export async function getServerSideProps() {
  const { data: posts } = await supabase
    .from('art_posts')
    .select('*')
    .order('created_at', { ascending: false })

  return { props: { posts: posts || [] } }
}

export default function Art({ posts }) {
  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center relative overflow-hidden bg-plum">
        <div className="absolute inset-0 bg-gradient-to-br from-plum via-plum to-plum-light" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-orchid/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-lavender/5 rounded-full blur-3xl" />
        <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
          <div className="text-[9px] tracking-[5px] text-orchid uppercase mb-6">Creativity · Expression · Design</div>
          <h1 className="font-serif text-5xl md:text-7xl font-light text-pearl mb-6">
            <em className="text-orchid italic">Art</em> Gallery
          </h1>
          <p className="text-sm leading-relaxed text-text max-w-xl mx-auto">
            A collection of creative work — digital art, photography, sketches, and design explorations.
          </p>
        </div>
      </div>

      <div className="section-padding bg-plum-light">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-5 mb-12">
            <span className="font-serif text-sm text-orchid tracking-[2px]">Gallery</span>
            <div className="w-12 h-px bg-orchid/50" />
            <h2 className="font-serif text-2xl md:text-3xl font-light text-pearl">
              Creative <em className="text-orchid italic">Works</em>
            </h2>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16 text-mauve-dim text-xs">
              No art posted yet — check back soon!
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-0.5 space-y-0.5">
              {posts.map(post => (
                <div key={post.id} className="break-inside-avoid bg-plum-light group relative overflow-hidden hover:-translate-y-0.5 transition-all duration-300">
                  {post.image_url ? (
                    <div className="relative">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-auto object-cover"
                      />
                      <div className="absolute inset-0 bg-plum/0 group-hover:bg-plum/60 transition-all duration-300 flex items-end">
                        <div className="p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <h3 className="font-serif text-lg text-pearl">{post.title}</h3>
                          <div className="text-[9px] tracking-[2px] uppercase text-orchid mt-1">{post.medium}</div>
                          {post.description && <p className="text-xs text-mauve-dim mt-2">{post.description}</p>}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 md:p-8">
                      <h3 className="font-serif text-lg text-pearl">{post.title}</h3>
                      {post.medium && <div className="text-[9px] tracking-[2px] uppercase text-orchid mt-1">{post.medium}</div>}
                      {post.description && <p className="text-sm text-mauve-dim mt-2">{post.description}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
