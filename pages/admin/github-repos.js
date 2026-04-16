import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import Toast from '../../components/Toast'
import { useAdminAuth } from '../../hooks/useAdminAuth'

export default function GithubRepos() {
  const { isAuthenticated, loading: authLoading } = useAdminAuth()
  const [repos, setRepos] = useState([])
  const [excluded, setExcluded] = useState([])
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  if (authLoading) return <AdminLayout title="GitHub Repos"><div className="text-center py-8 text-text-dim">Loading...</div></AdminLayout>
  if (!isAuthenticated) return null

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [reposRes, excludedRes] = await Promise.all([
        fetch('/api/github/repos'),
        fetch('/api/admin/github-settings')
      ])
      
      const reposData = await reposRes.json()
      const excludedData = await excludedRes.json()
      
      setRepos(Array.isArray(reposData) ? reposData : [])
      setExcluded(Array.isArray(excludedData) ? excludedData : [])
    } catch (err) {
      setToast({ message: 'Failed to fetch repos', type: 'error' })
    }
    setLoading(false)
  }

  const toggleRepo = (repoName) => {
    setExcluded(prev => 
      prev.includes(repoName)
        ? prev.filter(r => r !== repoName)
        : [...prev, repoName]
    )
  }

  const saveChanges = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/github-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repos: excluded })
      })
      
      if (res.ok) {
        setToast({ message: 'Settings saved!', type: 'success' })
      } else {
        setToast({ message: 'Failed to save', type: 'error' })
      }
    } catch {
      setToast({ message: 'Failed to save', type: 'error' })
    }
    setSaving(false)
  }

  const visibleCount = repos.filter(r => !excluded.includes(r.name)).length
  const excludedCount = repos.length - visibleCount

  return (
    <AdminLayout title="GitHub Repos">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="bg-dark-2 p-6 border border-gold/10 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-serif text-lg text-cream mb-1">Show/Hide Repos</h3>
            <p className="text-xs text-text-dim">
              Toggle repos to show or hide them from your portfolio. 
              <span className="text-gold ml-2">{visibleCount} visible</span>, 
              <span className="text-text-dim ml-1">{excludedCount} hidden</span>
            </p>
          </div>
          <button 
            onClick={saveChanges} 
            disabled={saving}
            className="btn-primary text-[10px] px-5 py-2.5"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loader">Loading repos...</div>
      ) : (
        <div className="flex flex-col gap-0.5">
          {repos.map(repo => (
            <div 
              key={repo.id} 
              className={`bg-dark-2 p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-gold/5 transition-all ${
                excluded.includes(repo.name) ? 'opacity-50' : ''
              }`}
            >
              <div className="flex-1 w-full">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-serif text-base text-cream">{repo.name}</h4>
                  <label className="relative inline-flex items-center cursor-pointer ml-auto md:ml-0">
                    <input
                      type="checkbox"
                      checked={!excluded.includes(repo.name)}
                      onChange={() => toggleRepo(repo.name)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-dark-3 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-text-dim after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold peer-checked:after:bg-dark peer-checked:after:ms-4"></div>
                    <span className="ms-3 text-xs text-text-dim">
                      {excluded.includes(repo.name) ? 'Hidden' : 'Visible'}
                    </span>
                  </label>
                </div>
                <p className="text-xs text-text-dim mb-2">{repo.description || 'No description'}</p>
                <div className="flex flex-wrap gap-3">
                  {repo.language && (
                    <span className="text-[9px] text-gold border border-gold/20 px-2 py-0.5">{repo.language}</span>
                  )}
                  <span className="text-[9px] text-text-dim">★ {repo.stars}</span>
                  <a href={repo.github_url} target="_blank" rel="noreferrer" className="text-[9px] text-gold hover:underline">GitHub ↗</a>
                  {repo.homepage && (
                    <a href={repo.homepage} target="_blank" rel="noreferrer" className="text-[9px] text-green-400 hover:underline">Live ↗</a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
