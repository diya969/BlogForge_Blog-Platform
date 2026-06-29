import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'

export default function EditPost() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm]     = useState({ title: '', summary: '', content: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get(`/posts/${id}`)
      .then(res => setForm({
        title:   res.data.title,
        summary: res.data.summary || '',
        content: res.data.content
      }))
      .catch(() => navigate('/home'))   // ✅ was navigate('/')
  }, [id])

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.put(`/posts/${id}`, form)
      navigate(`/post/${id}`)           // ✅ was /posts/${id}
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>✏️ Edit Post</h1>
      </div>

      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              className="form-control"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Summary</label>
            <input
              className="form-control"
              name="summary"
              value={form.summary}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Content *</label>
            <textarea
              className="form-control"
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={12}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : '💾 Save Changes'}
            </button>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => navigate(`/post/${id}`)}  // ✅ already correct
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}