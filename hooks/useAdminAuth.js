import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'

export function useAdminAuth() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const hasChecked = useRef(false)

  useEffect(() => {
    if (!router.isReady) return

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
        
        // Token invalid, clear cache and redirect
        localStorage.removeItem('admin_session')
        setIsAuthenticated(false)
        router.replace('/admin/login')
        setLoading(false)
      } else {
        // No cached session, verify with backend
        if (!hasChecked.current) {
          hasChecked.current = true
          try {
            const res = await fetch('/api/admin/verify')
            if (res.ok) {
              setIsAuthenticated(true)
              localStorage.setItem('admin_session', 'true')
            } else {
              router.replace('/admin/login')
            }
          } catch {
            router.replace('/admin/login')
          } finally {
            setLoading(false)
          }
        }
      }
    }

    checkAuth()
  }, [router, router.isReady])

  return { isAuthenticated, loading }
}

export function clearAdminSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_session')
  }
}
