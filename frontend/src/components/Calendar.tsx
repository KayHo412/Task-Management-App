import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns'
import '../styles/calendar.css'

interface Task {
  id: string
  title: string
  dueDate?: string
  done: boolean
  priority?: string
}

interface CalendarProps {
  tasks: Task[]
}

export default function Calendar({ tasks }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)

  // Get first and last day of month to know where to start the calendar grid
  const startDate = new Date(monthStart)
  startDate.setDate(startDate.getDate() - startDate.getDay())

  const endDate = new Date(monthEnd)
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()))

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false
      const taskDate = new Date(task.dueDate)
      return isSameDay(taskDate, date)
    })
  }

  const isOverdue = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    return checkDate < today
  }

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : []

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>
          <ChevronLeft size={18} />
        </button>
        <h2>{format(currentDate, 'MMMM yyyy')}</h2>
        <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="calendar-grid">
        {/* Weekday headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="weekday-header">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((day, index) => {
          const dayTasks = getTasksForDate(day)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          const hasOverdue = dayTasks.some(t => isOverdue(day) && !t.done)

          return (
            <div
              key={index}
              className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isSelected ? 'selected' : ''} ${hasOverdue ? 'has-overdue' : ''}`}
              onClick={() => setSelectedDate(day)}
            >
              <div className="day-number">{format(day, 'd')}</div>
              <div className="day-indicators">
                {dayTasks.length > 0 && (
                  <>
                    {dayTasks.slice(0, 2).map((task, idx) => (
                      <div
                        key={idx}
                        className={`task-indicator priority-${task.priority || 'medium'} ${task.done ? 'done' : ''}`}
                        title={task.title}
                      />
                    ))}
                    {dayTasks.length > 2 && (
                      <div className="task-count">+{dayTasks.length - 2}</div>
                    )}
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Task details for selected date */}
      {selectedDate && (
        <div className="calendar-details">
          <div className="details-header">
            <h3>📋 {format(selectedDate, 'EEEE, MMMM d')}</h3>
            <button onClick={() => setSelectedDate(null)}>✕</button>
          </div>
          <div className="details-body">
            {selectedDateTasks.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>
                No tasks scheduled for this date
              </p>
            ) : (
              <div className="details-tasks">
                {selectedDateTasks.map(task => (
                  <div key={task.id} className={`detail-task ${task.done ? 'done' : ''}`}>
                    <input type="checkbox" checked={task.done} readOnly />
                    <span className={`task-title ${task.done ? 'line-through' : ''}`}>{task.title}</span>
                    <span className={`priority-badge priority-${task.priority || 'medium'}`}>
                      {task.priority || 'medium'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
