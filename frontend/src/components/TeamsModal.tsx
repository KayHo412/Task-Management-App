import { useState } from 'react'
import { X, Plus, UserPlus, Trash2 } from 'lucide-react'
import '../styles/modal.css'

interface Team {
  id: string
  name: string
}

interface TeamsModalProps {
  teams: Team[]
  selectedTeam: string | null
  onSelectTeam: (teamId: string) => void
  onTeamsUpdate: () => void
  token: string
  onClose: () => void
}

export default function TeamsModal({
  teams,
  selectedTeam,
  onSelectTeam,
  onTeamsUpdate,
  token,
  onClose
}: TeamsModalProps) {
  const [newTeamName, setNewTeamName] = useState('')
  const [memberEmail, setMemberEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTeamName.trim()) return

    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newTeamName }),
      })
      if (!response.ok) throw new Error('Failed to create team')
      setNewTeamName('')
      onTeamsUpdate()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create team')
    } finally {
      setLoading(false)
    }
  }

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!memberEmail.trim() || !selectedTeam) return

    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/teams/${selectedTeam}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userEmail: memberEmail, role: 'member' }),
      })
      if (!response.ok) throw new Error('Failed to add member')
      setMemberEmail('')
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add member')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTeam = async (teamId: string) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return

    try {
      const response = await fetch(`${API_URL}/api/teams/${teamId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error('Failed to delete team')
      onTeamsUpdate()
      if (selectedTeam === teamId) {
        onSelectTeam(teams.find(t => t.id !== teamId)?.id || '')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete team')
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>👥 Teams</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="error-message">
              <span>⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <h3>Create Team</h3>
            <form onSubmit={handleCreateTeam} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Team name"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                disabled={loading}
              />
              <button type="submit" disabled={loading} style={{ background: 'var(--primary)' }}>
                <Plus size={16} />
                Create
              </button>
            </form>
          </div>

          <div className="form-group">
            <h3>Your Teams ({teams.length})</h3>
            {teams.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No teams yet. Create one to get started!</p>
            ) : (
              <div className="teams-list">
                {teams.map(team => (
                  <div key={team.id} className="team-item">
                    <div>
                      <strong>{team.name}</strong>
                      <span style={{ marginLeft: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        {selectedTeam === team.id && '(Selected)'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {selectedTeam !== team.id && (
                        <button onClick={() => onSelectTeam(team.id)} style={{ background: 'var(--primary)' }}>
                          Select
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteTeam(team.id)}
                        style={{ background: 'var(--danger)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedTeam && (
            <div className="form-group">
              <h3>Add Team Member</h3>
              <form onSubmit={handleAddMember} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="email"
                  placeholder="Member email"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  disabled={loading}
                />
                <button type="submit" disabled={loading} style={{ background: 'var(--success)' }}>
                  <UserPlus size={16} />
                  Add
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
