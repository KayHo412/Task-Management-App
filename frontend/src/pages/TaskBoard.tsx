import { useState, useEffect } from 'react'
import TaskList from '../components/TaskList'
import TaskForm from '../components/TaskForm'
import '../styles/TaskBoard.css'

interface Task {
  id: string
  title: string
  body?: string
  done: boolean
}

interface TaskBoardProps {
  token: string
  onLogout: () => void
}

export default function TaskBoard({ token, onLogout }: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error('Failed to fetch tasks')
      const data = await response.json()
      setTasks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleAddTask = async (title: string, body: string) => {
    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, body }),
      })
      if (!response.ok) throw new Error('Failed to create task')
      const newTask = await response.json()
      setTasks([...tasks, newTask])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task')
    }
  }

  const handleToggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return

    try {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ done: !task.done }),
      })
      if (!response.ok) throw new Error('Failed to update task')
      setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task')
    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error('Failed to delete task')
      setTasks(tasks.filter(t => t.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task')
    }
  }

  return (
    <div className="taskboard">
      <header className="taskboard-header">
        <h1>📋 TaskBoard</h1>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </header>

      {error && <div className="error">{error}</div>}

      <TaskForm onAddTask={handleAddTask} />

      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : (
        <TaskList
          tasks={tasks}
          onToggle={handleToggleTask}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  )
}