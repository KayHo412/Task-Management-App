import { Trash2, Calendar, Flag, Edit2 } from 'lucide-react'
import { format, isPast, isToday, isTomorrow } from 'date-fns'

interface Task {
  id: string
  title: string
  body?: string
  done: boolean
  priority?: string
  dueDate?: string
  order?: number
}

interface TaskListProps {
  tasks: Task[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit?: (task: Task) => void
}

export default function TaskList({ tasks, onToggle, onDelete, onEdit }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <div style={{ fontSize: '2rem' }}>🎉</div>
        <div className="empty-state-title">No tasks here</div>
        <div className="empty-state-text">Great job! Add a new task to get started.</div>
      </div>
    )
  }

  const formatDescription = (text: string) => {
    // Parse markdown-like formatting
    let formatted = text
    // Bold: **text**
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic: *text*
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Bullet points: - text
    formatted = formatted.replace(/^- (.*?)$/gm, '<li>$1</li>')
    // Wrap lists
    formatted = formatted.replace(/(<li>.*?<\/li>)/s, '<ul>$1</ul>')
    return formatted
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'low':
        return '#10b981'
      case 'high':
        return '#ef4444'
      default:
        return '#f59e0b'
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    const date = new Date(dateString)
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    return format(date, 'MMM d')
  }

  return (
    <div className="task-list">
      {tasks.map(task => {
        const dueDate = task.dueDate ? new Date(task.dueDate) : null
        const isOverdue = dueDate && isPast(dueDate) && !task.done
        const dueDateText = formatDate(task.dueDate)

        return (
          <div key={task.id} className={`task-item ${task.done ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
            <div className="task-header">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => onToggle(task.id)}
                className="task-checkbox"
              />
              <div className="task-title">{task.title}</div>
            </div>

            {task.body && (
              <div
                className="task-description"
                dangerouslySetInnerHTML={{ __html: formatDescription(task.body) }}
              />
            )}

            <div className="task-meta">
              {task.priority && task.priority !== 'medium' && (
                <div className={`task-priority ${task.priority}`} style={{ borderBottom: `2px solid ${getPriorityColor(task.priority)}` }}>
                  <Flag size={14} />
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </div>
              )}
              {dueDateText && (
                <div className={`task-date ${isOverdue ? 'overdue' : ''}`}>
                  <Calendar size={14} />
                  {dueDateText}
                </div>
              )}
            </div>

            <div className="task-actions">
              <button
                onClick={() => onToggle(task.id)}
                className="task-btn"
                title={task.done ? 'Mark as incomplete' : 'Mark as complete'}
              >
                {task.done ? '↩️ Undo' : '✓ Done'}
              </button>
              {onEdit && (
                <button
                  onClick={() => onEdit(task)}
                  className="task-btn"
                  title="Edit task"
                >
                  <Edit2 size={14} />
                </button>
              )}
              <button
                onClick={() => onDelete(task.id)}
                className="task-btn danger"
                title="Delete task"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}