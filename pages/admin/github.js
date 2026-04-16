import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import Toast from '../../components/Toast'
import { useAdminAuth } from '../../hooks/useAdminAuth'

export default function GithubSync() {
  const { isAuthenticated, loading: authLoading } = useAdminAuth()
  if (authLoading) return <AdminLayout title="GitHub Sync"><div className="text-center py-8 text-text-dim">Loading...</div></AdminLayout>
  if (!isAuthenticated) return null
  const [repos, setRepos] = useState([])
  const [toast, setToast] = useState(null)
  const [fetching, setFetching] = useState(false)
  const [syncing, setSyncing] = useState(null)

  const fetchRepos = async () => {
    setFetching(true)
    try {
      const res = await fetch('/api/github/repos')
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setRepos(data)
    } catch {
      setToast({ message: 'Failed to fetch repos', type: 'error' })
    }
    setFetching(false)
  }

  const syncRepo = async (repo) => {
    setSyncing(repo.name)
    try {
      const res = await fetch('/api/github/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoName: repo.name }),
      })
      if (res.ok) {
        setToast({ message: `${repo.name} synced to projects!`, type: 'success' })
      } else {
        setToast({ message: 'Sync failed', type: 'error' })
      }
    } catch {
      setToast({ message: 'Sync error', type: 'error' })
    }
    setSyncing(null)
  }

  return (
    <AdminLayout title="GitHub Sync">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="bg-dark-2 p-7 border border-gold/10 mb-8">
        <div className="text-xs text-text leading-relaxed mb-5">
          Pull your repositories directly from GitHub and add them to your projects database. Click <strong className="text-gold">Fetch Repos</strong> to load your repos, then <strong className="text-gold">Sync</strong> to add them to your site.
        </div>
        <button className="btn-primary px-7 py-3" onClick={fetchRepos} disabled={fetching}>
          {fetching ? 'Fetching...' : '⟳ Fetch My GitHub Repos'}
        </button>
      </div>

      {repos.length > 0 ? (
        <div className="flex flex-col gap-0.5">
          {repos.map(repo => (
            <div key={repo.github_id} className="bg-dark-2 p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-gold/5">
              <div className="flex-1">
                <div className="font-serif text-lg text-cream mb-1">{repo.name}</div>
                <div className="text-xs text-text-dim mb-3">{repo.description || 'No description'}</div>
                <div className="flex flex-wrap gap-3">
                  {repo.language && (
                    <span className="text-[9px] text-gold tracking-[1px] border border-gold/20 px-2 py-1">{repo.language}</span>
                  )}
                  {repo.stars > 0 && (
                    <span className="text-[9px] text-text-dim">★ {repo.stars}</span>
                  )}
                  {repo.homepage && (
                    <a href={repo.homepage} target="_blank" rel="noreferrer" className="text-[9px] text-green-400 hover:underline">Live ↗</a>
                  )}
                  <a href={repo.github_url} target="_blank" rel="noreferrer" className="text-[9px] text-gold hover:underline">GitHub ↗</a>
                </div>
              </div>
              <button
                className="btn-outline text-[10px] px-5 py-2 shrink-0"
                onClick={() => syncRepo(repo)}
                disabled={syncing === repo.name}
              >
                {syncing === repo.name ? 'Syncing...' : 'Sync →'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-text-dim text-xs py-16">
          Click "Fetch My GitHub Repos" to load your repositories
        </div>
      )}
    </AdminLayout>
  )
}
