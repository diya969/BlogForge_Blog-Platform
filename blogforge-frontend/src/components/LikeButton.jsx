import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function LikeButton({ postId, initialCount = 0, initialLiked = false }) {
  const [liked, setLiked]       = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(initialCount)
  const [loading, setLoading]   = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleLike = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    if (loading) return
    setLoading(true)

    // Optimistic update — update UI instantly
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)

    try {
      const res = await api.post(`/posts/${postId}/like`)
      setLiked(res.data.liked)
      setLikeCount(res.data.likeCount)
    } catch {
      // Revert if failed
      setLiked(liked)
      setLikeCount(likeCount)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      style={{
        display:        'flex',
        alignItems:     'center',
        gap:            '6px',
        padding:        '8px 16px',
        borderRadius:   '20px',
        border:         liked ? '1px solid #0a66c2' : '1px solid #ddd',
        background:     liked ? '#e8f0fe' : 'white',
        color:          liked ? '#0a66c2' : '#666',
        cursor:         loading ? 'not-allowed' : 'pointer',
        fontSize:       '0.9rem',
        fontWeight:     liked ? '600' : '400',
        transition:     'all 0.2s',
        fontFamily:     'Inter, sans-serif'
      }}
    >
      <span style={{ fontSize: '1.1rem' }}>
        {liked ? '👍' : '👍'}
      </span>
      <span>{liked ? 'Liked' : 'Like'}</span>
      {likeCount > 0 && (
        <span style={{
          background:   liked ? '#0a66c2' : '#888',
          color:        'white',
          borderRadius: '10px',
          padding:      '1px 7px',
          fontSize:     '0.75rem',
          fontWeight:   '600'
        }}>
          {likeCount}
        </span>
      )}
    </button>
  )
}