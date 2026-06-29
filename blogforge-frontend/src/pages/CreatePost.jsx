import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function CreatePost() {
  const [form, setForm]           = useState({ title: '', summary: '', content: '' })
  const [image, setImage]         = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB')
      return
    }
    setImage(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let imageUrl = null

      if (image) {
        setUploading(true)
        const formData = new FormData()
        formData.append('file', image)
        const uploadRes = await api.post('/upload/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        imageUrl = uploadRes.data.imageUrl
        setUploading(false)
      }

      const res = await api.post('/posts', { ...form, imageUrl })
      navigate(`/post/${res.data.id}`)   // ✅ fixed — /post/ not /posts/

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post')
    } finally {
      setLoading(false)
      setUploading(false)
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>✍️ Write a New Post</h1>
      </div>

      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              className="form-control"
              name="title"
              placeholder="Enter an eye-catching title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Summary <span style={{ color: '#aaa' }}>(optional)</span></label>
            <input
              className="form-control"
              name="summary"
              placeholder="Short description shown in post list"
              value={form.summary}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Content *</label>
            <textarea
              className="form-control"
              name="content"
              placeholder="Write your post content here..."
              value={form.content}
              onChange={handleChange}
              rows={10}
              required
            />
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label>
              Post Image <span style={{ color: '#aaa' }}>(optional)</span>
            </label>
            <div
              style={{
                border:       '2px dashed #ddd',
                borderRadius: '8px',
                padding:      '20px',
                textAlign:    'center',
                cursor:       'pointer',
                background:   '#fafafa'
              }}
              onClick={() => document.getElementById('imageInput').click()}
            >
              {imagePreview ? (
                <div>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth:     '100%',
                      maxHeight:    '300px',
                      borderRadius: '8px',
                      objectFit:    'cover'
                    }}
                  />
                  <p style={{ marginTop: '8px', color: '#888', fontSize: '0.85rem' }}>
                    Click to change image
                  </p>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '2.5rem' }}>🖼️</div>
                  <p style={{ color: '#888', margin: '8px 0 4px' }}>
                    Click to upload an image
                  </p>
                  <p style={{ color: '#bbb', fontSize: '0.8rem' }}>
                    JPG, PNG, WEBP — max 5MB
                  </p>
                </div>
              )}
            </div>
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading || uploading}
            >
              {uploading ? '📤 Uploading image...'
                : loading ? '🚀 Publishing...'
                : '🚀 Publish Post'}
            </button>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => navigate('/home')}  // ✅ fixed — /home not /
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}