import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import Toast from '../../components/Toast'
import { useAdminAuth } from '../../hooks/useAdminAuth'

export default function AdminSettings() {
  const { isAuthenticated, loading: authLoading } = useAdminAuth()
  const [visibleCategories, setVisibleCategories] = useState([])
  const [visibleRepos, setVisibleRepos] = useState([])
  const [allRepos, setAllRepos] = useState([])
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const categories = ['Restaurant Tech', 'Cafe Tech', 'Education', 'Brand & Fashion', 'Browser Extension', 'Fitness', 'Personal Growth', 'Food & Community', 'GitHub']

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchSettings()
      fetchAllRepos()
    }
  }, [authLoading, isAuthenticated])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings')
      const data = await res.json()
      setVisibleCategories(data.visible_categories || categories)
      setVisibleRepos(data.visible_repos || [])
    } catch (err) {
      console.error('Failed to fetch settings', err)
      setVisibleCategories(categories)
    }
    setLoading(false)
  }

  const fetchAllRepos = async () => {
    try {
      const res = await fetch('/api/github/repos-public')
      const data = await res.json()
      setAllRepos(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to fetch repos', err)
    }
  }

  const toggleCategory = (cat) => {
    if (visibleCategories.includes(cat)) {
      setVisibleCategories(visibleCategories.filter(c => c !== cat))
    } else {
      setVisibleCategories([...visibleCategories, cat])
    }
  }

  const toggleRepo = (repoName) => {
    if (visibleRepos.includes(repoName)) {
      setVisibleRepos(visibleRepos.filter(r => r !== repoName))
    } else {
      setVisibleRepos([...visibleRepos, repoName])
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible_categories: visibleCategories, visible_repos: visibleRepos })
      })
      if (res.ok) {
        setToast({ message: 'Settings saved!', type: 'success' })
      } else {
        setToast({ message: 'Failed to save settings', type: 'error' })
      }
    } catch (err) {
      setToast({ message: 'Error saving settings', type: 'error' })
    }
    setSaving(false)
  }

  if (authLoading) return <AdminLayout title="Settings"><div className="text-center py-8 text-mauve-dim">Loading...</div></AdminLayout>
  if (!isAuthenticated) return null

  return (
    <AdminLayout title="Settings">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="space-y-8">
        {/* Categories */}
        <div className="p-7 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}>
          <div className="text-[9px] tracking-[3px] uppercase mb-6" style={{ color: 'var(--accent)' }}>Visible Categories</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {categories.map(cat => (
              <label key={cat} className="flex items-center gap-3 cursor-pointer p-3 border rounded transition-all" style={{ borderColor: visibleCategories.includes(cat) ? 'var(--accent)' : 'var(--border-light)' }}>
                <input
                  type="checkbox"
                  checked={visibleCategories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                  className="w-4 h-4 cursor-pointer"
                  style={{ accentColor: 'var(--accent)' }}
                />
                <span style={{ color: 'var(--mauve)' }}>{cat}</span>
              </label>
            ))}
          </div>
        </div>

        {/* GitHub Repos */}
        <div className="p-7 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}>
          <div className="text-[9px] tracking-[3px] uppercase mb-6" style={{ color: 'var(--accent)' }}>Visible GitHub Repos</div>
          {loading ? (
            <div className="text-center py-4 text-mauve-dim">Loading repos...</div>
          ) : allRepos.length === 0 ? (
            <div className="text-center py-4 text-mauve-dim text-xs">No synced repos found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {allRepos.map(repo => (
                <label key={repo.id} className="flex items-start gap-3 cursor-pointer p-3 border rounded transition-all" style={{ borderColor: visibleRepos.includes(repo.name) ? 'var(--accent)' : 'var(--border-light)' }}>
                  <input
                    type="checkbox"
                    checked={visibleRepos.includes(repo.name)}
                    onChange={() => toggleRepo(repo.name)}
                    className="w-4 h-4 cursor-pointer mt-1"
                    style={{ accentColor: 'var(--accent)' }}
                  />
                  <div className="flex-1">
                    <div style={{ color: 'var(--pearl)' }} className="text-sm">{repo.name}</div>
                    <div style={{ color: 'var(--mauve-dim)' }} className="text-xs">{repo.category || 'GitHub'}</div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex gap-3">
          <button
            onClick={saveSettings}
            disabled={saving}
            className="btn-primary px-7 py-3"
          >
            {saving ? 'Saving...' : '✓ Save Settings'}
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}
