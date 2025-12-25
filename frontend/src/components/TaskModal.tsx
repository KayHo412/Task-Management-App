import { useState, useEffect } from 'react'
import { X, AlertCircle, Bold, Italic } from 'lucide-react'

interface TaskModalProps {
  onAddTask: (title: string, body: string, priority: string, dueDate?: string) => void
  onEditTask?: (title: string, body: string, priority: string, dueDate?: string) => void
  onClose: () => void
  editingTask?: {
    id: string
    title: string
    body?: string
    priority?: string
    dueDate?: string
  } | null
}

export default function TaskModal({ onAddTask, onEditTask, onClose, editingTask }: TaskModalProps) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const isEditing = !!editingTask

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title)
      setBody(editingTask.body || '')
      setPriority(editingTask.priority || 'medium')
      setDueDate(editingTask.dueDate ? new Date(editingTask.dueDate).toISOString().split('T')[0] : '')
    }
  }, [editingTask])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      setError('Task title is required')
      return
    }

    setLoading(true)
    try {
      if (isEditing && onEditTask) {
        await onEditTask(title, body, priority, dueDate)
      } else {
        await onAddTask(title, body, priority, dueDate)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${isEditing ? 'update' : 'add'} task`)
    } finally {
      setLoading(false)
    }
  }

  const insertFormatting = (before: string, after: string = '') => {
    const textarea = document.querySelector('.form-textarea') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = body.substring(start, end)
    const newBody = body.substring(0, start) + before + selectedText + after + body.substring(end)
    setBody(newBody)

    setTimeout(() => {
      textarea.selectionStart = start + before.length
      textarea.selectionEnd = start + before.length + selectedText.length
      textarea.focus()
    }, 0)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="modal-header">{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', fontSize: '1.5rem' }}
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="error-message" style={{ marginBottom: '1rem' }}>
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="form-label">Description</label>
              <div className="formatting-buttons" style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => insertFormatting('**', '**')}
                  disabled={loading}
                  title="Bold"
                  style={{ padding: '0.25rem 0.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Bold size={14} color="currentColor" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('*', '*')}
                  disabled={loading}
                  title="Italic"
                  style={{ padding: '0.25rem 0.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Italic size={14} color="currentColor" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('- ')}
                  disabled={loading}
                  title="Bullet point"
                  style={{ padding: '0.25rem 0.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  •
                </button>
              </div>
            </div>
            <textarea
              className="form-textarea"
              placeholder="Add more details about this task... Use **text** for bold, *text* for italic, or - for bullets"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={loading}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                disabled={loading}
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="primary"
              disabled={loading}
            >
              {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Task' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
