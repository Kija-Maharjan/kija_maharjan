import { supabase } from '../lib/supabase'
import Layout from '../components/Layout'
import Link from 'next/link'

export async function getServerSideProps() {
  const { data: posts } = await supabase
    .from('gym_posts')
    .select('*')
    .order('created_at', { ascending: false })

  return { props: { posts: posts || [] } }
}

export default function Gym({ posts }) {
  const difficultyColor = (d) => {
    if (d === 'Beginner') return '#4caf50'
    if (d === 'Intermediate') return 'var(--accent)'
    if (d === 'Advanced') return '#e07070'
    return 'var(--mauve-dim)'
  }

  const stats = [
    { num: posts.length, label: 'Workouts' },
    { num: [...new Set(posts.map(p => p.workout_type).filter(Boolean))].length, label: 'Types' },
    { num: '∞', label: 'Reps Coded' },
    { num: '💪', label: 'Gains' },
  ]

  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center relative overflow-hidden bg-plum">
        <div className="absolute inset-0 bg-gradient-to-br from-plum via-plum to-plum-light" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-lavender/5 rounded-full blur-3xl" />
        <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
          <div className="text-[9px] tracking-[5px] text-lavender uppercase mb-6">Discipline · Growth · Strength</div>
          <h1 className="font-serif text-5xl md:text-7xl font-light text-pearl mb-6">
            <em className="text-lavender italic">Fitness</em> & Gym
          </h1>
          <p className="text-sm leading-relaxed text-text max-w-xl mx-auto">
            Workout logs, training routines, and fitness updates — sharing the journey of staying consistent and getting stronger every day.
          </p>
        </div>
      </div>

      <div className="section-padding bg-plum-light">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-0.5 mb-16">
            {stats.map((stat, i) => (
              <div key={i} className="bg-plum-lighter p-6 md:p-8 text-center border-l-2 border-transparent hover:border-lavender transition-all duration-300">
                <div className="font-serif text-3xl md:text-4xl font-light text-lavender leading-tight">{stat.num}</div>
                <div className="text-[9px] tracking-[2px] uppercase text-mauve-dim mt-2">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-5 mb-12">
            <span className="font-serif text-sm text-lavender tracking-[2px]">Workouts</span>
            <div className="w-12 h-px bg-lavender/50" />
            <h2 className="font-serif text-2xl md:text-3xl font-light text-pearl">
              Training <em className="text-lavender italic">Log</em>
            </h2>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16 text-mauve-dim text-xs">
              No workouts posted yet — check back soon!
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {posts.map(post => (
                <div key={post.id} className="bg-plum-light p-6 md:p-8 border-l-2 border-transparent hover:border-lavender transition-all duration-300 group cursor-default">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {post.workout_type && (
                          <span className="text-[8px] tracking-[2px] uppercase px-2 py-0.5 border border-lavender/20 text-lavender">{post.workout_type}</span>
                        )}
                        {post.difficulty && (
                          <span className="text-[8px] tracking-[2px] uppercase" style={{ color: difficultyColor(post.difficulty) }}>{post.difficulty}</span>
                        )}
                      </div>
                      <h3 className="font-serif text-lg text-pearl mb-2">{post.title}</h3>
                      {post.content && <p className="text-sm leading-relaxed text-mauve-dim whitespace-pre-line">{post.content}</p>}
                    </div>
                    <div className="text-[9px] text-mauve-dim shrink-0">{new Date(post.created_at).toLocaleDateString()}</div>
                  </div>
                  {post.image_url && (
                    <div className="mt-4 max-w-md">
                      <img src={post.image_url} alt={post.title} className="w-full rounded" />
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
