import { useState } from 'react'
import api from '../api/axios'

export default function CommentItem({
  comment, user, postId, onDelete, onReplyAdded, formatDate, isReply = false
}) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyText, setReplyText]         = useState('')
  const [submitting, setSubmitting]       = useState(false)
  const [editing, setEditing]             = useState(false)
  const [editText, setEditText]           = useState(comment.content)

  const handleReply = async (e) => {
    e.preventDefault()
    if (!replyText.trim()) return
    setSubmitting(true)
    try {
      const res = await api.post(`/posts/${postId}/comments`, {
        content:  replyText,
        parentId: comment.id
      })
      onReplyAdded(res.data, comment.id)
      setReplyText('')
      setShowReplyForm(false)
    } catch {
      alert('Failed to post reply.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = async () => {
    if (!editText.trim()) return
    try {
      await api.put(`/comments/${comment.id}`, { content: editText })
      comment.content = editText
      setEditing(false)
    } catch {
      alert('Failed to update comment.')
    }
  }

  return (
    <div style={{
      paddingLeft:  isReply ? '24px' : '0',
      borderLeft:   isReply ? '3px solid #e94560' : 'none',
      marginLeft:   isReply ? '12px' : '0',
      marginBottom: '12px'
    }}>
      <div className="comment-item">
        <div>
          <span className="comment-author">{comment.authorUsername}</span>
          <span className="comment-date">{formatDate(comment.createdAt)}</span>
          {isReply && (
            <span style={{
              fontSize:    '0.75rem',
              color:       '#e94560',
              marginLeft:  '8px',
              fontWeight:  '600'
            }}>
              ↩ Reply
            </span>
          )}
        </div>

        {editing ? (
          <div style={{ marginTop: '8px' }}>
            <textarea
              className="form-control"
              value={editText}
              onChange={e => setEditText(e.target.value)}
              rows={2}
            />
            <div className="comment-actions" style={{ marginTop: '8px' }}>
              <button className="btn btn-primary btn-sm" onClick={handleEdit}>
                Save
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="comment-content">{comment.content}</p>

            <div className="comment-actions">
              {/* Reply button — only for logged in users on top-level comments */}
              {user && !isReply && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowReplyForm(!showReplyForm)}
                >
                  ↩ Reply
                </button>
              )}

              {/* Edit/Delete — only for comment owner */}
              {user?.username === comment.authorUsername && (
                <>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setEditing(true)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(comment.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <form
          onSubmit={handleReply}
          style={{
            marginTop:  '10px',
            marginLeft: '12px',
            padding:    '12px',
            background: '#f8f9fa',
            borderRadius: '8px'
          }}
        >
          <textarea
            className="form-control"
            placeholder={`Reply to ${comment.authorUsername}...`}
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            rows={2}
            required
          />
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button
              className="btn btn-primary btn-sm"
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Posting...' : '↩ Post Reply'}
            </button>
            <button
              className="btn btn-secondary btn-sm"
              type="button"
              onClick={() => setShowReplyForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div style={{ marginTop: '8px' }}>
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              user={user}
              postId={postId}
              onDelete={onDelete}
              onReplyAdded={onReplyAdded}
              formatDate={formatDate}
              isReply={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}