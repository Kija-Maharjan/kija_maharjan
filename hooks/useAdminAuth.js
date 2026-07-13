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
      try {
        const res = await fetch('/api/admin/verify')
        if (res.ok) {
          setIsAuthenticated(true)
          if (typeof window !== 'undefined') localStorage.setItem('admin_session', 'true')
        } else {
          if (typeof window !== 'undefined') localStorage.removeItem('admin_session')
          setIsAuthenticated(false)
          router.replace('/')
        }
      } catch {
        if (typeof window !== 'undefined') localStorage.removeItem('admin_session')
        setIsAuthenticated(false)
        router.replace('/')
      } finally {
        setLoading(false)
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
