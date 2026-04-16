import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'

export function useAdminAuth() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const hasChecked = useRef(false)

  useEffect(() => {
    if (!router.isReady || hasChecked.current) return

    hasChecked.current = true

    const checkAuth = async () => {
      // Check if we have a cached auth state
      const cached = typeof window !== 'undefined' ? localStorage.getItem('admin_session') : null
      
      if (cached === 'true') {
        // Session exists, verify with backend
        try {
          const res = await fetch('/api/admin/verify')
          if (res.ok) {
            setIsAuthenticated(true)
            setLoading(false)
            return
          }
        } catch {
          // Backend error, but keep session alive if cached
          setIsAuthenticated(true)
          setLoading(false)
          return
        }
        
        // Token invalid, clear cache and redirect to home
        localStorage.removeItem('admin_session')
        setIsAuthenticated(false)
        setLoading(false)
        console.log('[Admin Auth] Session invalid, redirecting to home')
        router.replace('/')
      } else {
        // No cached session, verify with backend
        try {
          const res = await fetch('/api/admin/verify')
          if (res.ok) {
            setIsAuthenticated(true)
            localStorage.setItem('admin_session', 'true')
          } else {
            setIsAuthenticated(false)
            console.log('[Admin Auth] No valid session, redirecting to home')
            router.replace('/')
          }
        } catch {
          setIsAuthenticated(false)
          console.log('[Admin Auth] Auth check failed, redirecting to home')
          router.replace('/')
        } finally {
          setLoading(false)
        }
      }
    }

    checkAuth()
  }, [router.isReady])

  return { isAuthenticated, loading }
}

export function clearAdminSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_session')
    console.log('[Admin Auth] Session cleared')
  }
}
