import { Trash2, Calendar, Flag } from 'lucide-react'
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
}

export default function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <div style={{ fontSize: '2rem' }}>🎉</div>
        <div className="empty-state-title">No tasks here</div>
        <div className="empty-state-text">Great job! Add a new task to get started.</div>
      </div>
    )
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

            {task.body && <div className="task-description">{task.body}</div>}

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