import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()

  const [profile, setProfile]     = useState(null)
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess]     = useState('')
  const [error, setError]         = useState('')

  const [passwordForm, setPasswordForm] = useState({
    currentPassword:  '',
    newPassword:      '',
    confirmPassword:  ''
  })

  useEffect(() => {
    api.get('/profile')
       .then(res => setProfile(res.data))
       .catch(() => navigate('/home'))   // ✅ fixed
       .finally(() => setLoading(false))
  }, [])

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await api.post('/profile/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setProfile(prev => ({ ...prev, profilePhoto: res.data.profilePhoto }))
      updateUser({ profilePhoto: res.data.profilePhoto })
      setSuccess('Profile photo updated!')
    } catch {
      setError('Failed to upload photo')
    } finally {
      setUploading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match')
      return
    }
    if (passwordForm.newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setSaving(true)
    try {
      await api.put('/profile', {
        currentPassword: passwordForm.currentPassword,
        newPassword:     passwordForm.newPassword
      })
      setSuccess('Password changed successfully!')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="loading">Loading profile...</div>
  if (!profile) return null

  return (
    <div className="container" style={{ maxWidth: '600px' }}>

      {/* ✅ fixed — goes to /home not / */}
      <span className="back-link" onClick={() => navigate('/home')}>
        ← Back to Posts
      </span>

      <div className="page-header">
        <h1>⚙️ Profile Settings</h1>
      </div>

      {error   && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Profile Photo */}
      <div className="card" style={{ textAlign: 'center' }}>
        <h3 style={{ marginBottom: '20px', color: '#1a1a2e' }}>
          Profile Photo
        </h3>

        <div style={{ position: 'relative', display: 'inline-block' }}>
          {profile.profilePhoto ? (
            <img
              src={profile.profilePhoto}
              alt="Profile"
              style={{
                width:        '100px',
                height:       '100px',
                borderRadius: '50%',
                objectFit:    'cover',
                border:       '3px solid #e94560'
              }}
            />
          ) : (
            <div style={{
              width:          '100px',
              height:         '100px',
              borderRadius:   '50%',
              background:     '#e94560',
              color:          'white',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              fontSize:       '2.5rem',
              fontWeight:     '700',
              margin:         '0 auto'
            }}>
              {profile.username[0].toUpperCase()}
            </div>
          )}
        </div>

        <div style={{ marginTop: '16px' }}>
          <button
            className="btn btn-outline"
            onClick={() => document.getElementById('photoInput').click()}
            disabled={uploading}
          >
            {uploading ? '📤 Uploading...' : '📷 Change Photo'}
          </button>
          <input
            id="photoInput"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handlePhotoUpload}
          />
        </div>

        <div style={{ marginTop: '20px', color: '#666' }}>
          <p style={{ fontWeight: '600', fontSize: '1.1rem', color: '#1a1a2e' }}>
            {profile.username}
          </p>
          <p style={{ fontSize: '0.9rem' }}>{profile.email}</p>
          <span className="badge" style={{ marginTop: '6px' }}>
            {profile.role === 'ROLE_ADMIN' ? '👑 Admin' : '👤 User'}
          </span>
        </div>
      </div>

      {/* Change Password */}
      <div className="card">
        <h3 style={{ marginBottom: '20px', color: '#1a1a2e' }}>
          🔐 Change Password
        </h3>

        <form onSubmit={handlePasswordChange}>
          <div className="form-group">
            <label>Current Password</label>
            <input
              className="form-control"
              type="password"
              placeholder="Enter current password"
              value={passwordForm.currentPassword}
              onChange={e => setPasswordForm({
                ...passwordForm, currentPassword: e.target.value
              })}
              required
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              className="form-control"
              type="password"
              placeholder="Min 6 characters"
              value={passwordForm.newPassword}
              onChange={e => setPasswordForm({
                ...passwordForm, newPassword: e.target.value
              })}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              className="form-control"
              type="password"
              placeholder="Repeat new password"
              value={passwordForm.confirmPassword}
              onChange={e => setPasswordForm({
                ...passwordForm, confirmPassword: e.target.value
              })}
              required
            />
          </div>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={saving}
          >
            {saving ? 'Saving...' : '🔐 Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}