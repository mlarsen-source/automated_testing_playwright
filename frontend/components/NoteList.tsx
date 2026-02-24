import NoteCard from './NoteCard'

interface Note {
  note_id: number
  title: string
  content?: string
}

interface NoteListProps {
  notes: Note[]
  onDelete: (id: number) => void
  onEdit: (note: Note) => void
}

export default function NoteList({ notes, onDelete, onEdit }: NoteListProps) {
  if (notes.length === 0) {
    return <p className="muted" data-testid="no-notes">No notes yet. Create one above!</p>
  }

  return (
    <div className="note-list" data-testid="note-list">
      {notes.map((note) => (
        <NoteCard key={note.note_id} note={note} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  )
}
