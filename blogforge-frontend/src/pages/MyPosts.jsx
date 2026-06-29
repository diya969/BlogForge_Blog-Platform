import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import PostCard from '../components/PostCard'
import { useAuth } from '../context/AuthContext'

export default function MyPosts() {
  const [posts, setPosts]   = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage]     = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const { user } = useAuth()
  const navigate = useNavigate()

  const fetchMyPosts = async (pg = 0) => {
    setLoading(true)
    try {
      const res = await api.get(`/posts/user/${user.username}?page=${pg}&size=6`)
      setPosts(res.data.content)
      setTotalPages(res.data.totalPages)
      setPage(pg)
    } catch {
      console.error('Failed to fetch posts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) fetchMyPosts(0)
  }, [user])

  const handleDelete = (deletedId) => {
    setPosts(posts.filter(p => p.id !== deletedId))
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>📝 My Posts</h1>
        <button className="btn btn-primary" onClick={() => navigate('/create')}>
          + New Post
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading your posts...</div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <h3>No posts yet</h3>
          <p>Start writing your first blog post!</p>
          <button
            className="btn btn-primary"
            style={{ marginTop: '16px' }}
            onClick={() => navigate('/create')}
          >
            ✍️ Write Now
          </button>
        </div>
      ) : (
        posts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            showActions={true}
            onDelete={handleDelete}
          />
        ))
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-secondary btn-sm"
            disabled={page === 0}
            onClick={() => fetchMyPosts(page - 1)}
          >
            ← Prev
          </button>
          <span>Page {page + 1} of {totalPages}</span>
          <button
            className="btn btn-secondary btn-sm"
            disabled={page >= totalPages - 1}
            onClick={() => fetchMyPosts(page + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}