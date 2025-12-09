import '../styles/TaskList.css'

interface Task {
  id: string
  title: string
  body?: string
  done: boolean
}

interface TaskListProps {
  tasks: Task[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export default function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return <div className="empty-state">No tasks yet. Create one to get started!</div>
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <div key={task.id} className={`task-item ${task.done ? 'done' : ''}`}>
          <input
            type="checkbox"
            checked={task.done}
            onChange={() => onToggle(task.id)}
            className="task-checkbox"
          />
          <div className="task-content">
            <h3>{task.title}</h3>
            {task.body && <p>{task.body}</p>}
          </div>
          <button
            onClick={() => onDelete(task.id)}
            className="delete-btn"
          >
            🗑️
          </button>
        </div>
      ))}
    </div>
  )
}