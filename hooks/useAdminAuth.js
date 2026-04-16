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
        } else {
          router.replace('/admin/login')
        }
      } catch {
        router.replace('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, router.isReady])

  return { isAuthenticated, loading }
}
