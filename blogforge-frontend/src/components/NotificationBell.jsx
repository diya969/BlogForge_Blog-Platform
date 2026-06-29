import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function NotificationBell() {
  const { user } = useAuth()
  const navigate  = useNavigate()

  const [open, setOpen]           = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount]     = useState(0)
  const [loading, setLoading]     = useState(false)
  const dropdownRef = useRef(null)

  // Fetch unread count every 30 seconds
  useEffect(() => {
    if (!user) return
    const fetchCount = () => {
      api.get('/notifications/unread-count')
         .then(res => setUnreadCount(res.data.count))
         .catch(() => {})
    }
    fetchCount()
    const interval = setInterval(fetchCount, 30000)
    return () => clearInterval(interval)
  }, [user])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleOpen = async () => {
    if (!open) {
      setLoading(true)
      try {
        const res = await api.get('/notifications')
        setNotifications(res.data)
        // Mark all as read
        await api.put('/notifications/mark-all-read')
        setUnreadCount(0)
      } catch {}
      finally { setLoading(false) }
    }
    setOpen(!open)
  }

  const handleClick = async (notification) => {
    await api.put(`/notifications/${notification.id}/read`).catch(() => {})
    setOpen(false)
    if (notification.postId) {
      navigate(`/post/${notification.postId}`)
    }
  }

  const getIcon = (type) => {
    if (type === 'COMMENT') return '💬'
    if (type === 'REPLY')   return '↩️'
    if (type === 'LIKE')    return '👍'
    return '🔔'
  }

  const formatTime = (dt) => {
    const diff = Date.now() - new Date(dt).getTime()
    const mins  = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days  = Math.floor(diff / 86400000)
    if (mins  < 1)  return 'just now'
    if (mins  < 60) return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  if (!user) return null

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>

      {/* Bell Button */}
      <button
        onClick={handleOpen}
        style={{
          position:   'relative',
          background: 'transparent',
          border:     '1px solid #555',
          borderRadius: '6px',
          padding:    '7px 12px',
          cursor:     'pointer',
          color:      '#ccc',
          fontSize:   '1.1rem',
          display:    'flex',
          alignItems: 'center',
          gap:        '4px'
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position:     'absolute',
            top:          '-6px',
            right:        '-6px',
            background:   '#e94560',
            color:        'white',
            borderRadius: '50%',
            width:        '18px',
            height:       '18px',
            fontSize:     '0.7rem',
            fontWeight:   '700',
            display:      'flex',
            alignItems:   'center',
            justifyContent: 'center'
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position:     'absolute',
          top:          '44px',
          right:        '0',
          width:        '320px',
          maxHeight:    '420px',
          overflowY:    'auto',
          background:   'white',
          borderRadius: '10px',
          boxShadow:    '0 8px 32px rgba(0,0,0,0.18)',
          zIndex:       500,
          fontFamily:   'Inter, sans-serif'
        }}>

          {/* Header */}
          <div style={{
            padding:        '14px 16px',
            borderBottom:   '1px solid #eee',
            fontWeight:     '700',
            fontSize:       '1rem',
            color:          '#1a1a2e',
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'center'
          }}>
            <span>🔔 Notifications</span>
            {notifications.length > 0 && (
              <span style={{ fontSize: '0.8rem', color: '#999', fontWeight: 400 }}>
                {notifications.length} total
              </span>
            )}
          </div>

          {/* List */}
          {loading ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#aaa' }}>
              Loading...
            </div>
          ) : notifications.length === 0 ? (
            <div style={{
              padding:   '32px 16px',
              textAlign: 'center',
              color:     '#aaa'
            }}>
              <div style={{ fontSize: '2rem' }}>🔔</div>
              <p style={{ marginTop: '8px', fontSize: '0.9rem' }}>
                No notifications yet
              </p>
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => handleClick(n)}
                style={{
                  padding:      '12px 16px',
                  borderBottom: '1px solid #f5f5f5',
                  cursor:       'pointer',
                  background:   n.isRead ? 'white' : '#fff8f9',
                  display:      'flex',
                  gap:          '12px',
                  alignItems:   'flex-start',
                  transition:   'background 0.15s'
                }}
                onMouseEnter={e =>
                  e.currentTarget.style.background = '#f8f9fa'}
                onMouseLeave={e =>
                  e.currentTarget.style.background = n.isRead
                    ? 'white' : '#fff8f9'}
              >
                {/* Actor Avatar */}
                <div style={{
                  width:          '36px',
                  height:         '36px',
                  borderRadius:   '50%',
                  flexShrink:     0,
                  overflow:       'hidden',
                  background:     '#e94560',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  color:          'white',
                  fontWeight:     '700'
                }}>
                  {n.actorPhoto ? (
                    <img
                      src={n.actorPhoto}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    n.actorUsername?.[0]?.toUpperCase()
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '1rem' }}>{getIcon(n.type)}</span>
                    <span style={{
                      fontSize:   '0.85rem',
                      color:      '#333',
                      lineHeight: '1.4'
                    }}>
                      {n.message}
                    </span>
                  </div>
                  <div style={{
                    fontSize:   '0.75rem',
                    color:      '#aaa',
                    marginTop:  '4px'
                  }}>
                    {formatTime(n.createdAt)}
                  </div>
                </div>

                {/* Unread dot */}
                {!n.isRead && (
                  <div style={{
                    width:        '8px',
                    height:       '8px',
                    borderRadius: '50%',
                    background:   '#e94560',
                    flexShrink:   0,
                    marginTop:    '4px'
                  }} />
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}