import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function PostCard({ post, onDelete, showActions = false }) {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return
    try {
      await api.delete(`/posts/${post.id}`)
      onDelete(post.id)
    } catch {
      alert('Failed to delete post.')
    }
  }

  const formatDate = (dt) =>
    new Date(dt).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric'
    })

  return (
    <div className="post-card">

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          onClick={() => navigate(`/post/${post.id}`)}
          style={{
            width: '100%', height: '200px', objectFit: 'cover',
            borderRadius: '6px', marginBottom: '12px', cursor: 'pointer'
          }}
        />
      )}

      <div
        className="post-card-title"
        onClick={() => navigate(`/post/${post.id}`)}
      >
        {post.title}
      </div>

      {post.summary && (
        <p className="post-card-summary">{post.summary}</p>
      )}

      <div className="post-card-meta">
        {/* ✅ Clickable author name */}
        <span
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/user/${post.authorUsername}`)
          }}
          style={{ cursor: 'pointer', color: '#e94560', fontWeight: '500' }}
        >
          ✍️ {post.authorUsername}
        </span>
        <span>🗓 {formatDate(post.createdAt)}</span>
        <span>👍 {post.likeCount ?? 0}</span>
        <span>💬 {post.commentCount} comments</span>
      </div>

      {showActions && user?.username === post.authorUsername && (
        <div className="post-card-actions">
          <button
            className="btn btn-outline btn-sm"
            onClick={() => navigate(`/edit/${post.id}`)}
          >
            Edit
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  )
}