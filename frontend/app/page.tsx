'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NoteList from '../components/NoteList'

interface Note {
  note_id: number
  title: string
  content?: string
}

export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Initial load: fetch notes; if not authenticated, the API returns 401 and we redirect to /login.
    fetch('/api/notes', { credentials: 'include' })
      .then((res) => {
        if (res.status === 401) {
          router.push('/login')
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (data) setNotes(data)
      })
      .finally(() => setLoading(false))
  }, [router])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    // Create a note via API; on success, append to local state for instant UI update.
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title, content }),
    })
    if (res.ok) {
      const note = await res.json()
      setNotes((prev) => [...prev, note])
      setTitle('')
      setContent('')
    }
  }

  async function handleDelete(id: number) {
    // Delete note via API then optimistically remove from state.
    await fetch(`/api/notes/${id}`, { method: 'DELETE', credentials: 'include' })
    setNotes((prev) => prev.filter((n) => n.note_id !== id))
  }

  if (loading) return <p className="muted">Loading...</p>

  return (
    <main className="page-shell">
      <div className="header-block">
        <div>
          <p className="pill">Playwright demo</p>
          <h1>My Notes</h1>
          <p className="muted">Create, view, and manage notes in a clean interface.</p>
        </div>
      </div>

      <div className="panel">
        <form onSubmit={handleCreate} className="note-form">
          <div className="row">
            <input
              className="input"
              type="text"
              placeholder="Note title"
              data-testid="note-title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="row">
            <textarea
              className="textarea"
              placeholder="Note content (optional)"
              data-testid="note-content-input"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div>
            <button className="btn" type="submit" data-testid="create-note-button">
              Add Note
            </button>
          </div>
        </form>
      </div>

      <div className="note-list">
        <NoteList notes={notes} onDelete={handleDelete} onEdit={() => {}} />
      </div>
    </main>
  )
}
