import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { useVisitorAuth } from '../hooks/useVisitorAuth'
import Link from 'next/link'

export async function getServerSideProps() {
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  const { data: projects } = await supabase
    .from('projects')
    .select('name')
    .order('name')

  return {
    props: {
      reviews: reviews || [],
      projects: projects || [],
    },
  }
}

export default function Community({ reviews, projects }) {
  const { user, loading: authLoading, logout, refresh: refreshAuth } = useVisitorAuth()
  const [chatMessages, setChatMessages] = useState([])
  const [chatForm, setChatForm] = useState({ user_name: '', user_email: '', message: '', project_name: '' })
  const [reviewForm, setReviewForm] = useState({ reviewer_name: '', reviewer_email: '', project_name: '', rating: 5, content: '' })
  const [toast, setToast] = useState(null)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    fetch('/api/chat-messages')
      .then(res => res.json())
      .then(data => setChatMessages(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (user) {
      setReviewForm(prev => ({ ...prev, reviewer_name: user.username, reviewer_email: user.email || '' }))
      setChatForm(prev => ({ ...prev, user_name: user.username, user_email: user.email || '' }))
    }
  }, [user])

  const submitReview = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewForm),
    })
    if (res.ok) {
      setToast({ message: 'Review submitted! Awaiting approval.', type: 'success' })
      setReviewForm(prev => ({ ...prev, project_name: '', rating: 5, content: '' }))
      setShowReviewForm(false)
    } else {
      const data = await res.json()
      setToast({ message: data.error || 'Failed to submit review', type: 'error' })
    }
  }

  const submitChat = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/chat-messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(chatForm),
    })
    if (res.ok) {
      setToast({ message: 'Message sent!', type: 'success' })
      setChatForm(prev => ({ ...prev, message: '', project_name: '' }))
      fetch('/api/chat-messages')
        .then(r => r.json())
        .then(data => setChatMessages(Array.isArray(data) ? data : []))
    } else {
      const data = await res.json()
      setToast({ message: data.error || 'Failed to send message', type: 'error' })
    }
  }

  const renderStars = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating)

  return (
    <Layout>
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 toast" style={{ backgroundColor: toast.type === 'success' ? 'rgba(40,100,40,0.9)' : 'rgba(100,30,30,0.9)', color: toast.type === 'success' ? '#a8e6a8' : '#e6a8a8', border: toast.type === 'success' ? '1px solid rgba(80,160,80,0.4)' : '1px solid rgba(160,60,60,0.4)' }}>
          <span className="text-[10px] tracking-[1px]">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-4 text-current opacity-70 hover:opacity-100">✕</button>
        </div>
      )}

      <div className="min-h-[60vh] flex items-center justify-center relative overflow-hidden bg-plum">
        <div className="absolute inset-0 bg-gradient-to-br from-plum via-plum to-plum-light" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-rose/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-blush/5 rounded-full blur-3xl" />
        <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
          <div className="text-[9px] tracking-[5px] text-rose uppercase mb-6">Reviews · Connect · Community</div>
          <h1 className="font-serif text-5xl md:text-7xl font-light text-pearl mb-6">
            <em className="text-rose italic">Community</em>
          </h1>
          <p className="text-sm leading-relaxed text-text max-w-xl mx-auto">
            See what people say about my work, leave a review for a project you&apos;ve used, or drop a message in the community chat.
          </p>
        </div>
      </div>

      <div className="section-padding bg-plum-light">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-5 mb-12">
            <span className="font-serif text-sm text-rose tracking-[2px]">Reviews</span>
            <div className="w-12 h-px bg-rose/50" />
            <h2 className="font-serif text-2xl md:text-3xl font-light text-pearl">
              What People <em className="text-rose italic">Say</em>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-8">
            {user ? (
              <button onClick={() => setShowReviewForm(!showReviewForm)} className={`btn-outline text-[10px] px-5 py-2.5 ${showReviewForm ? 'bg-rose/20' : ''}`}>
                {showReviewForm ? '− Close Form' : '+ Leave a Review'}
              </button>
            ) : (
              <Link href="/login" className="btn-outline text-[10px] px-5 py-2.5">
                Login to Review
              </Link>
            )}
          </div>

          {showReviewForm && user && (
            <div className="p-6 border mb-8 max-w-2xl" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}>
              <form onSubmit={submitReview}>
                <div className="form-row mb-4">
                  <div>
                    <label className="text-[9px] tracking-[2px] uppercase block mb-2" style={{ color: 'var(--mauve-dim)' }}>Name</label>
                    <input className="form-input" value={reviewForm.reviewer_name} disabled />
                  </div>
                  <div>
                    <label className="text-[9px] tracking-[2px] uppercase block mb-2" style={{ color: 'var(--mauve-dim)' }}>Email</label>
                    <input className="form-input" type="email" value={reviewForm.reviewer_email} disabled />
                  </div>
                </div>
                <div className="form-row mb-4">
                  <div>
                    <label className="text-[9px] tracking-[2px] uppercase block mb-2" style={{ color: 'var(--mauve-dim)' }}>Project</label>
                    <select className="form-select" value={reviewForm.project_name} onChange={e => setReviewForm({ ...reviewForm, project_name: e.target.value })}>
                      <option value="">General feedback</option>
                      {projects.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] tracking-[2px] uppercase block mb-2" style={{ color: 'var(--mauve-dim)' }}>Rating</label>
                    <div className="flex gap-1 pt-1">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button key={n} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: n })} className="text-lg bg-transparent border-none cursor-pointer transition-colors" style={{ color: n <= reviewForm.rating ? '#e8c84a' : 'var(--mauve-dim)' }}>
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="text-[9px] tracking-[2px] uppercase block mb-2" style={{ color: 'var(--mauve-dim)' }}>Your Review *</label>
                  <textarea className="form-textarea" value={reviewForm.content} onChange={e => setReviewForm({ ...reviewForm, content: e.target.value })} required />
                </div>
                <button type="submit" className="btn-primary text-[10px] px-6 py-2.5">Submit Review</button>
              </form>
            </div>
          )}

          {reviews.length === 0 ? (
            <div className="text-center py-16 text-mauve-dim text-xs">No reviews yet — be the first!</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0.5 mb-16">
              {reviews.map(review => (
                <div key={review.id} className="bg-plum-light p-6 md:p-7 border-l-2 border-transparent hover:border-rose transition-all duration-300">
                  <div className="text-sm mb-2" style={{ color: '#e8c84a' }}>{renderStars(review.rating)}</div>
                  <p className="text-xs leading-relaxed text-text mb-4 italic">&ldquo;{review.content}&rdquo;</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[9px] tracking-[2px] uppercase text-pearl">{review.reviewer_name}</div>
                      {review.project_name && <div className="text-[8px] tracking-[1px] text-mauve-dim mt-0.5">on {review.project_name}</div>}
                    </div>
                    <div className="text-[8px] text-mauve-dim">{new Date(review.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-rose/20 pt-12">
            <div className="flex items-center justify-between gap-5 mb-8">
              <div className="flex items-center gap-5">
                <span className="font-serif text-sm text-rose tracking-[2px]">Chat</span>
                <div className="w-12 h-px bg-rose/50" />
                <h2 className="font-serif text-2xl md:text-3xl font-light text-pearl">
                  Service <em className="text-rose italic">Community</em>
                </h2>
              </div>
              {user ? (
                <button onClick={() => setShowChat(!showChat)} className="btn-outline text-[10px] px-5 py-2.5">
                  {showChat ? '− Hide' : '+ Message'}
                </button>
              ) : (
                <Link href="/login" className="btn-outline text-[10px] px-5 py-2.5">
                  Login to Chat
                </Link>
              )}
            </div>

            {showChat && user && (
              <div className="p-6 border mb-8 max-w-2xl" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}>
                <form onSubmit={submitChat}>
                  <div className="form-row mb-4">
                    <div>
                      <label className="text-[9px] tracking-[2px] uppercase block mb-2" style={{ color: 'var(--mauve-dim)' }}>Name</label>
                      <input className="form-input" value={chatForm.user_name} disabled />
                    </div>
                    <div>
                      <label className="text-[9px] tracking-[2px] uppercase block mb-2" style={{ color: 'var(--mauve-dim)' }}>Email</label>
                      <input className="form-input" type="email" value={chatForm.user_email} disabled />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="text-[9px] tracking-[2px] uppercase block mb-2" style={{ color: 'var(--mauve-dim)' }}>Related Project</label>
                    <select className="form-select" value={chatForm.project_name} onChange={e => setChatForm({ ...chatForm, project_name: e.target.value })}>
                      <option value="">General chat</option>
                      {projects.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="text-[9px] tracking-[2px] uppercase block mb-2" style={{ color: 'var(--mauve-dim)' }}>Message *</label>
                    <textarea className="form-textarea" value={chatForm.message} onChange={e => setChatForm({ ...chatForm, message: e.target.value })} required />
                  </div>
                  <button type="submit" className="btn-primary text-[10px] px-6 py-2.5">Send Message</button>
                </form>
              </div>
            )}

            <div className="flex flex-col gap-3 max-w-2xl">
              {chatMessages.length === 0 ? (
                <div className="text-center py-8 text-mauve-dim text-xs">No messages yet</div>
              ) : (
                chatMessages.map(msg => (
                  <div key={msg.id} className="p-4 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] tracking-[2px] uppercase text-pearl font-medium">{msg.user_name}</span>
                        {msg.project_name && <span className="text-[8px] tracking-[1px] text-rose">on {msg.project_name}</span>}
                      </div>
                      <span className="text-[8px] text-mauve-dim">{new Date(msg.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-text">{msg.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
