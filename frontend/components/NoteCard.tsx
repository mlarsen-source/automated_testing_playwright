interface Note {
  note_id: number
  title: string
  content?: string
}

interface NoteCardProps {
  note: Note
  onDelete: (id: number) => void
  onEdit: (note: Note) => void
}

// Pure React component - no Next.js imports so it works in component tests (Vite) too
export default function NoteCard({ note, onDelete, onEdit }: NoteCardProps) {
  return (
    <div data-testid="note-card" className="note-card card">
      <h3>{note.title}</h3>
      {note.content && <p>{note.content}</p>}
      <div className="actions">
        <button className="btn secondary" data-testid="edit-button" onClick={() => onEdit(note)}>
          Edit
        </button>
        <button className="btn danger" data-testid="delete-button" onClick={() => onDelete(note.note_id)}>
          Delete
        </button>
      </div>
    </div>
  )
}
