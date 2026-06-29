import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import NotificationBell from './NotificationBell'  // ✅ ADD

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">✍️ BlogForge</Link>
        <div className="navbar-links">
          {user ? (
            <>
              <div
                style={{ display: 'flex', alignItems: 'center',
                         gap: '8px', cursor: 'pointer' }}
                onClick={() => navigate('/profile')}
              >
                {user.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt="profile"
                    style={{
                      width: '32px', height: '32px',
                      borderRadius: '50%', objectFit: 'cover',
                      border: '2px solid #e94560'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '32px', height: '32px',
                    borderRadius: '50%', background: '#e94560',
                    color: 'white', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontWeight: '700', fontSize: '0.9rem'
                  }}>
                    {user.username?.[0]?.toUpperCase()}
                  </div>
                )}
                <span style={{ color: '#aaa', fontSize: '0.9rem' }}>
                  {user.username}
                </span>
              </div>

              <NotificationBell />   {/* ✅ ADD */}

              <Link to="/my-posts">
                <button className="btn btn-secondary">My Posts</button>
              </Link>
              <Link to="/create">
                <button className="btn btn-primary">+ New Post</button>
              </Link>
              <button className="btn btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="btn btn-secondary">Login</button>
              </Link>
              <Link to="/register">
                <button className="btn btn-primary">Register</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}