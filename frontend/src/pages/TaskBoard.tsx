import { useState, useEffect } from 'react'
import { Plus, LogOut, Menu, Settings } from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import type { DropResult } from '@hello-pangea/dnd'
import TaskList from '../components/TaskList'
import TaskModal from '../components/TaskModal'
import SettingsModal from '../components/SettingsModal'
import TeamsModal from '../components/TeamsModal'
import '../styles/dashboard.css'
import '../styles/tasks.css'

interface Task {
  id: string
  title: string
  body?: string
  done: boolean
  priority?: string
  dueDate?: string
  order?: number
  teamId?: string
}

interface Team {
  id: string
  name: string
}

interface TaskBoardProps {
  token: string
  onLogout: () => void
}

export default function TaskBoard({ token, onLogout }: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showTeams, setShowTeams] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  )

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

  // Apply theme on mount and when changed
  useEffect(() => {
    localStorage.setItem('theme', theme)
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [theme])

  useEffect(() => {
    fetchTeams()
    fetchTasks()
  }, [selectedTeam])

  const fetchTeams = async () => {
    try {
      const response = await fetch(`${API_URL}/api/teams`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setTeams(data)
        if (data.length > 0 && !selectedTeam) {
          setSelectedTeam(data[0].id)
        }
      }
    } catch (err) {
      console.error('Failed to fetch teams:', err)
    }
  }

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

  const handleAddTask = async (title: string, body: string, priority: string = 'medium', dueDate?: string) => {
    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          body,
          priority,
          dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
          teamId: selectedTeam,
        }),
      })
      if (!response.ok) throw new Error('Failed to create task')
      const newTask = await response.json()
      setTasks([...tasks, newTask])
      setShowModal(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task')
    }
  }

  const handleEditTask = async (title: string, body: string, priority: string = 'medium', dueDate?: string) => {
    if (!editingTask) return

    try {
      const response = await fetch(`${API_URL}/api/tasks/${editingTask.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          body,
          priority,
          dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        }),
      })
      if (!response.ok) throw new Error('Failed to update task')
      const updatedTask = await response.json()
      setTasks(tasks.map(t => t.id === editingTask.id ? updatedTask : t))
      setEditingTask(null)
      setShowModal(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task')
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

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result

    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const task = tasks.find(t => t.id === draggableId)
    if (!task) return

    const sourceIsDone = source.droppableId === 'done'
    const destIsDone = destination.droppableId === 'done'

    if (sourceIsDone !== destIsDone) {
      // Moving to different column, toggle done status
      try {
        const response = await fetch(`${API_URL}/api/tasks/${draggableId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ done: destIsDone }),
        })
        if (!response.ok) throw new Error('Failed to update task')
        setTasks(tasks.map(t => t.id === draggableId ? { ...t, done: destIsDone } : t))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update task')
      }
    }

    // Update order
    try {
      await fetch(`${API_URL}/api/tasks/${draggableId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ order: destination.index }),
      })
    } catch (err) {
      console.error('Failed to update task order:', err)
    }
  }

  const todoTasks = tasks
    .filter(t => !t.done && (selectedTeam ? t.teamId === selectedTeam : !t.teamId))
    .sort((a, b) => (a.order || 0) - (b.order || 0))
  const completedTasks = tasks
    .filter(t => t.done && (selectedTeam ? t.teamId === selectedTeam : !t.teamId))
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    <div className="dashboard" data-theme={theme}>
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="sidebar">
          <div className="sidebar-header">
            <h2>✨ TaskFlow</h2>
          </div>

          <div className="sidebar-content">
            <div className="sidebar-section">
              <div className="sidebar-section-title">Navigation</div>
              <button
                className={`sidebar-item ${!selectedTeam ? 'active' : ''}`}
                onClick={() => setSelectedTeam(null)}
              >
                <span>📋</span>
                My Tasks
              </button>
              <button className="sidebar-item" onClick={() => setShowTeams(true)}>
                <span>👥</span>
                Teams
              </button>
              <button className="sidebar-item" onClick={() => setShowSettings(true)}>
                <span>⚙️</span>
                Settings
              </button>
            </div>

            {teams.length > 0 && (
              <div className="sidebar-section">
                <div className="sidebar-section-title">Your Teams</div>
                {teams.map(team => (
                  <button
                    key={team.id}
                    className={`sidebar-item ${selectedTeam === team.id ? 'active' : ''}`}
                    onClick={() => setSelectedTeam(team.id)}
                  >
                    <span>🏢</span>
                    {team.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="sidebar-footer">
            <button onClick={onLogout} className="danger">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem' }}
              className="mobile-menu-btn"
            >
              <Menu size={24} />
            </button>
            <div className="header-title">
              📋 {selectedTeam ? teams.find(t => t.id === selectedTeam)?.name : 'My Tasks'}
            </div>
          </div>

          <div className="header-actions">
            <button
              onClick={() => setShowSettings(true)}
              style={{ background: 'transparent', borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              <Settings size={18} />
            </button>
            <button onClick={() => setShowModal(true)} style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', color: 'white', borderColor: 'transparent' }}>
              <Plus size={18} />
              Add Task
            </button>
          </div>
        </div>

        <div className="content-area">
          {error && (
            <div className="error-message">
              <span>⚠️</span>
              {error}
            </div>
          )}

          {loading ? (
            <div className="loading">Loading your tasks...</div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="tasks-container">
                <Droppable droppableId="todo">
                  {(provided, snapshot) => (
                    <div
                      className={`task-column ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <div className="task-column-header">
                        <div className="task-column-title">
                          📝 To Do
                          <span className="task-count">{todoTasks.length}</span>
                        </div>
                      </div>
                      <div className="task-list">
                        {todoTasks.length === 0 ? (
                          <div className="task-list-empty">
                            <div style={{ fontSize: '2rem' }}>🎯</div>
                            <div className="empty-state-title">No tasks</div>
                            <div className="empty-state-text">Create a task to get started</div>
                          </div>
                        ) : (
                          todoTasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`draggable-task-wrapper ${snapshot.isDragging ? 'dragging' : ''}`}
                                  style={{
                                    ...provided.draggableProps.style,
                                    zIndex: snapshot.isDragging ? 1000 : 'auto',
                                  }}
                                >
                                  <TaskList
                                    tasks={[task]}
                                    onToggle={handleToggleTask}
                                    onDelete={handleDeleteTask}
                                    onEdit={(t) => {
                                      setEditingTask(t)
                                      setShowModal(true)
                                    }}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                      </div>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                <Droppable droppableId="done">
                  {(provided, snapshot) => (
                    <div
                      className={`task-column ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <div className="task-column-header">
                        <div className="task-column-title">
                          ✅ Done
                          <span className="task-count">{completedTasks.length}</span>
                        </div>
                      </div>
                      <div className="task-list">
                        {completedTasks.length === 0 ? (
                          <div className="task-list-empty">
                            <div style={{ fontSize: '2rem' }}>🎉</div>
                            <div className="empty-state-title">No completed tasks</div>
                            <div className="empty-state-text">Great job! Keep going</div>
                          </div>
                        ) : (
                          completedTasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`draggable-task-wrapper ${snapshot.isDragging ? 'dragging' : ''}`}
                                  style={{
                                    ...provided.draggableProps.style,
                                    zIndex: snapshot.isDragging ? 1000 : 'auto',
                                  }}
                                >
                                  <TaskList
                                    tasks={[task]}
                                    onToggle={handleToggleTask}
                                    onDelete={handleDeleteTask}
                                    onEdit={(t) => {
                                      setEditingTask(t)
                                      setShowModal(true)
                                    }}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                      </div>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </DragDropContext>
          )}
        </div>
      </div>

      {/* Task Modal */}
      {showModal && (
        <TaskModal
          onAddTask={handleAddTask}
          onEditTask={editingTask ? handleEditTask : undefined}
          editingTask={editingTask}
          onClose={() => {
            setShowModal(false)
            setEditingTask(null)
          }}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          theme={theme}
          onThemeChange={setTheme}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Teams Modal */}
      {showTeams && (
        <TeamsModal
          teams={teams}
          selectedTeam={selectedTeam}
          onSelectTeam={setSelectedTeam}
          onTeamsUpdate={fetchTeams}
          token={token}
          onClose={() => setShowTeams(false)}
        />
      )}

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block !important;
          }

          .sidebar {
            display: ${sidebarOpen ? 'flex' : 'none'};
          }
        }
      `}</style>
    </div>
  )
}