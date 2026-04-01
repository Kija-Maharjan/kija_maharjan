import { useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import Toast from '../../components/Toast'

export default function GithubSync() {
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

      <div style={{ background: 'var(--dark2)', padding: '28px', border: '1px solid rgba(184,150,12,0.1)', marginBottom: '32px' }}>
        <div style={{ fontSize: '12px', color: 'var(--text)', lineHeight: 1.7, marginBottom: '20px' }}>
          Pull your repositories directly from GitHub and add them to your projects database. Click <strong style={{ color: 'var(--gold)' }}>Fetch Repos</strong> to load your repos, then <strong style={{ color: 'var(--gold)' }}>Sync</strong> to add them to your site.
        </div>
        <button className="btn-primary" onClick={fetchRepos} disabled={fetching} style={{ padding: '12px 28px' }}>
          {fetching ? 'Fetching...' : '⟳ Fetch My GitHub Repos'}
        </button>
      </div>

      {repos.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {repos.map(repo => (
            <div key={repo.github_id} style={{ background: 'var(--dark2)', padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(184,150,12,0.05)', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', color: 'var(--cream)', marginBottom: '4px' }}>{repo.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '6px' }}>{repo.description || 'No description'}</div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {repo.language && <span style={{ fontSize: '9px', color: 'var(--gold)', letterSpacing: '1px', border: '1px solid rgba(184,150,12,0.2)', padding: '2px 8px' }}>{repo.language}</span>}
                  {repo.stars > 0 && <span style={{ fontSize: '9px', color: 'var(--text-dim)' }}>★ {repo.stars}</span>}
                  {repo.homepage && <a href={repo.homepage} target="_blank" rel="noreferrer" style={{ fontSize: '9px', color: '#a8e6a8' }}>Live ↗</a>}
                  <a href={repo.github_url} target="_blank" rel="noreferrer" style={{ fontSize: '9px', color: 'var(--gold)' }}>GitHub ↗</a>
                </div>
              </div>
              <button
                className="btn-outline"
                style={{ padding: '8px 20px', fontSize: '9px', flexShrink: 0 }}
                onClick={() => syncRepo(repo)}
                disabled={syncing === repo.name}
              >
                {syncing === repo.name ? 'Syncing...' : 'Sync →'}
              </button>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
GithubSync.getInitialProps = () => ({ adminPage: true })
