import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import PostCard from '../components/PostCard'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const [posts, setPosts]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [keyword, setKeyword]       = useState('')
  const [searching, setSearching]   = useState(false)
  const [page, setPage]             = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [searchType, setSearchType] = useState('posts')
  const [userResults, setUserResults] = useState([])
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) navigate('/landing')
  }, [user])

  const fetchPosts = async (pg = 0) => {
    setLoading(true)
    try {
      const res = await api.get(`/posts?page=${pg}&size=6`)
      setPosts(res.data.content)
      setTotalPages(res.data.totalPages)
      setPage(pg)
    } catch {
      console.error('Failed to fetch posts')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!keyword.trim()) {
      fetchPosts(0)
      setSearching(false)
      setUserResults([])
      return
    }
    setLoading(true)
    setSearching(true)
    try {
      if (searchType === 'users') {
        const res = await api.get(`/users/search?keyword=${keyword}`)
        setUserResults(res.data)
        setPosts([])
      } else {
        const res = await api.get(`/posts/search?keyword=${keyword}&page=0&size=6`)
        setPosts(res.data.content)
        setTotalPages(res.data.totalPages)
        setPage(0)
        setUserResults([])
      }
    } catch {
      console.error('Search failed')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  const handleClear = () => {
    setKeyword('')
    setSearching(false)
    setUserResults([])
    fetchPosts(0)
  }

  useEffect(() => { fetchPosts(0) }, [])

  return (
    <div className="container">
      <div className="page-header">
        <h1>📰 Latest Posts</h1>
        {user && (
          <button className="btn btn-primary" onClick={() => navigate('/create')}>
            + Write a Post
          </button>
        )}
      </div>

      {/* Search Type Toggle */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button
          className={`btn btn-sm ${searchType === 'posts' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => { setSearchType('posts'); setUserResults([]) }}
        >
          📰 Posts
        </button>
        <button
          className={`btn btn-sm ${searchType === 'users' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => { setSearchType('users'); setPosts([]) }}
        >
          👤 Users
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          className="form-control"
          placeholder={searchType === 'users' ? 'Search users...' : 'Search posts...'}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="btn btn-primary" onClick={handleSearch}>Search</button>
        {searching && (
          <button className="btn btn-secondary" onClick={handleClear}>Clear</button>
        )}
      </div>

      {/* User Results */}
      {userResults.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <h3 style={{ marginBottom: '12px', color: '#555' }}>
            👤 Users matching "{keyword}"
          </h3>
          {userResults.map(u => (
            <div
              key={u.username}
              onClick={() => navigate(`/user/${u.username}`)}
              style={{
                display:      'flex',
                alignItems:   'center',
                gap:          '14px',
                padding:      '14px 18px',
                background:   'white',
                borderRadius: '10px',
                marginBottom: '10px',
                boxShadow:    '0 1px 6px rgba(0,0,0,0.08)',
                cursor:       'pointer',
                transition:   'box-shadow 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.08)'}
            >
              <div style={{
                width:          '46px',
                height:         '46px',
                borderRadius:   '50%',
                background:     '#e94560',
                color:          'white',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                fontWeight:     '700',
                fontSize:       '1.2rem',
                flexShrink:     0
              }}>
                {u.username[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{u.username}</div>
                <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '2px' }}>
                  {u.postCount} {u.postCount === 1 ? 'post' : 'posts'}
                </div>
              </div>
              <div style={{ marginLeft: 'auto', color: '#ccc', fontSize: '1.1rem' }}>→</div>
            </div>
          ))}
        </div>
      )}

      {/* User search empty state */}
      {searchType === 'users' && searching && userResults.length === 0 && !loading && (
        <div className="empty-state">
          <h3>No users found</h3>
          <p>Try a different username.</p>
        </div>
      )}

      {/* Post Results */}
      {searchType === 'posts' && (
        loading ? (
          <div className="loading">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <h3>No posts found</h3>
            <p>{searching ? 'Try a different keyword.' : 'Be the first to write!'}</p>
          </div>
        ) : (
          posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        )
      )}

      {/* Pagination — only for posts */}
      {searchType === 'posts' && totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-secondary btn-sm"
            disabled={page === 0}
            onClick={() => fetchPosts(page - 1)}
          >
            ← Prev
          </button>
          <span>Page {page + 1} of {totalPages}</span>
          <button
            className="btn btn-secondary btn-sm"
            disabled={page >= totalPages - 1}
            onClick={() => fetchPosts(page + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}