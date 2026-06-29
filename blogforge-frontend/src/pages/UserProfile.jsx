import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import PostCard from '../components/PostCard'

export default function UserProfile() {
  const { username } = useParams()
  const navigate = useNavigate()
  const [posts, setPosts]   = useState([])
  const [loading, setLoading] = useState(true)

useEffect(() => {
  api.get(`/posts/by-user/${username}`)  // ✅ new endpoint, returns plain list
     .then(res => setPosts(res.data))
     .catch(() => navigate('/home'))
     .finally(() => setLoading(false))
}, [username])

  return (
    <div className="container">
      <span className="back-link" onClick={() => navigate('/home')}>
        ← Back to Posts
      </span>

      <div style={{
        display:      'flex',
        alignItems:   'center',
        gap:          '16px',
        padding:      '24px 0',
        borderBottom: '1px solid #eee',
        marginBottom: '24px'
      }}>
        <div style={{
          width:          '64px',
          height:         '64px',
          borderRadius:   '50%',
          background:     '#e94560',
          color:          'white',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          fontWeight:     '800',
          fontSize:       '1.6rem'
        }}>
          {username[0].toUpperCase()}
        </div>
        <div>
          <h2 style={{ margin: 0 }}>{username}</h2>
          <p style={{ margin: '4px 0 0', color: '#999', fontSize: '0.9rem' }}>
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <h3>No posts yet</h3>
          <p>{username} hasn't written anything yet.</p>
        </div>
      ) : (
        posts.map(post => <PostCard key={post.id} post={post} />)
      )}
    </div>
  )
}