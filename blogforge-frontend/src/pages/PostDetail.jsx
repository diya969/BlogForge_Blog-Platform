import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import LikeButton from '../components/LikeButton'
import CommentItem from '../components/CommentItem'

export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [post, setPost]         = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading]   = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const formatDate = (dt) =>
    new Date(dt).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [postRes, commentsRes] = await Promise.all([
          api.get(`/posts/${id}`),
          api.get(`/posts/${id}/comments`)
        ])
        setPost(postRes.data)
        setComments(commentsRes.data)
      } catch {
        navigate('/home')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [id])

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    setSubmitting(true)
    try {
      const res = await api.post(`/posts/${id}/comments`, { content: newComment })
      setComments([res.data, ...comments])
      setNewComment('')
    } catch {
      alert('Failed to add comment.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return
    try {
      await api.delete(`/comments/${commentId}`)
      setComments(prev =>
        prev
          .filter(c => c.id !== commentId)
          .map(c => ({
            ...c,
            replies: (c.replies || []).filter(r => r.id !== commentId)
          }))
      )
    } catch {
      alert('Failed to delete comment.')
    }
  }

  const handleReplyAdded = (reply, parentId) => {
    setComments(prev =>
      prev.map(c =>
        c.id === parentId
          ? { ...c, replies: [...(c.replies || []), reply] }
          : c
      )
    )
  }

  const handleDeletePost = async () => {
    if (!window.confirm('Delete this post permanently?')) return
    try {
      await api.delete(`/posts/${id}`)
      navigate('/home')
    } catch {
      alert('Failed to delete post.')
    }
  }

  if (loading) return <div className="loading">Loading post...</div>
  if (!post)   return null

  return (
    <div className="container">
      <span className="back-link" onClick={() => navigate('/home')}>
        ← Back to Posts
      </span>

      <div className="post-detail">
        <h1>{post.title}</h1>

        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title}
            style={{
              width: '100%', maxHeight: '400px', objectFit: 'cover',
              borderRadius: '8px', marginBottom: '16px'
            }}
          />
        )}

        <div className="post-detail-meta">
          ✍️ <strong
            onClick={() => navigate(`/user/${post.authorUsername}`)}
            style={{ cursor: 'pointer', color: '#e94560' }}
          >
            {post.authorUsername}
          </strong>
          &nbsp;|&nbsp; 🗓 {formatDate(post.createdAt)}
          {post.updatedAt !== post.createdAt &&
            ` (edited ${formatDate(post.updatedAt)})`}
          &nbsp;|&nbsp; 💬 {post.commentCount} comments
        </div>

        <div className="post-detail-content">{post.content}</div>

        <div style={{
          marginTop: '20px', paddingTop: '16px', paddingBottom: '16px',
          borderTop: '1px solid #eee', borderBottom: '1px solid #eee',
          display: 'flex', alignItems: 'center', gap: '12px'
        }}>
          <LikeButton
            postId={post.id}
            initialCount={post.likeCount}
            initialLiked={post.likedByMe}
          />
        </div>

        {user?.username === post.authorUsername && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => navigate(`/edit/${post.id}`)}
            >
              ✏️ Edit Post
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={handleDeletePost}
            >
              🗑 Delete Post
            </button>
          </div>
        )}
      </div>

      <div className="comments-section">
        <h3>💬 Comments ({comments.length})</h3>

        {user ? (
          <form className="comment-form" onSubmit={handleAddComment}>
            <h4>Leave a Comment</h4>
            <div className="form-group">
              <textarea
                className="form-control"
                placeholder="Write your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                required
              />
            </div>
            <button
              className="btn btn-primary btn-sm"
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Posting...' : '💬 Post Comment'}
            </button>
          </form>
        ) : (
          <div className="alert alert-error" style={{ marginTop: '16px' }}>
            <span
              style={{ color: '#e94560', cursor: 'pointer', fontWeight: 500 }}
              onClick={() => navigate('/login')}
            >
              Login
            </span>{' '}
            to leave a comment.
          </div>
        )}

        {comments.length === 0 ? (
          <div className="empty-state" style={{ padding: '30px 0' }}>
            <p>No comments yet. Be the first!</p>
          </div>
        ) : (
          comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              user={user}
              postId={id}
              onDelete={handleDeleteComment}
              onReplyAdded={handleReplyAdded}
              formatDate={formatDate}
              isReply={false}
            />
          ))
        )}
      </div>
    </div>
  )
}