import { Note } from '../models/index.js'

export async function getNotes(req, res) {
  try {
    const notes = await Note.findAll({ where: { user_id: req.user.user_id } })
    res.json(notes)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
}

export async function createNote(req, res) {
  const { title, content } = req.body

  if (!title) {
    return res.status(400).json({ error: 'Title required' })
  }

  try {
    const note = await Note.create({ user_id: req.user.user_id, title, content })
    res.status(201).json(note)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
}

export async function updateNote(req, res) {
  const { id } = req.params
  const { title, content } = req.body

  try {
    const note = await Note.findOne({ where: { note_id: id, user_id: req.user.user_id } })
    if (!note) {
      return res.status(404).json({ error: 'Note not found' })
    }
    await note.update({ title, content })
    res.json(note)
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
}

export async function deleteNote(req, res) {
  const { id } = req.params

  try {
    const note = await Note.findOne({ where: { note_id: id, user_id: req.user.user_id } })
    if (!note) {
      return res.status(404).json({ error: 'Note not found' })
    }
    await note.destroy()
    res.json({ message: 'Note deleted' })
  } catch {
    res.status(500).json({ error: 'Server error' })
  }
}
