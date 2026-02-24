/**
 * COMPONENT TESTS - NoteCard
 *
 * Purpose: validate the presentational NoteCard in isolation, no Next.js or API.
 *
 * Why needed:
 * - Confirms titles/content render.
 * - Verifies callbacks fire with correct payloads (edit/delete).
 * - Ensures empty content doesn’t crash or render stray markup.
 *
 * Runner: Playwright component testing (Vite dev server per test).
 */
import { test, expect } from '@playwright/experimental-ct-react'
import NoteCard from '../components/NoteCard'

type Note = { note_id: number; title: string; content?: string }

const sampleNote: Note = { note_id: 1, title: 'Sample Note', content: 'Hello from component tests' }

test('renders the note title', async ({ mount }) => {
  // Mount component with sample note
  const component = await mount(
    <NoteCard note={sampleNote} onDelete={() => {}} onEdit={() => {}} />
  )
  // Assert: title visible
  await expect(component.getByText('Sample Note')).toBeVisible()
})

test('renders the note content', async ({ mount }) => {
  // Mount with content
  const component = await mount(
    <NoteCard note={sampleNote} onDelete={() => {}} onEdit={() => {}} />
  )
  // Assert: content visible
  await expect(component.getByText('Hello from component tests')).toBeVisible()
})

test('renders without content when content is omitted', async ({ mount }) => {
  const noteWithoutContent = { note_id: 2, title: 'Title Only' }
  // Mount without content field
  const component = await mount(
    <NoteCard note={noteWithoutContent} onDelete={() => {}} onEdit={() => {}} />
  )
  // Assert: card renders, but no <p> content
  await expect(component.getByTestId('note-card')).toBeVisible()
  // No paragraph element for content
  await expect(component.locator('p')).not.toBeVisible()
})

test('calls onDelete with the correct note_id when delete is clicked', async ({ mount }) => {
  let deletedId: number | undefined

  // Mount with spy-like callback
  const component = await mount(
    <NoteCard
      note={sampleNote}
      onDelete={(id) => {
        deletedId = id
      }}
      onEdit={() => {}}
    />
  )

  // Act: click delete
  await component.getByTestId('delete-button').click()
  // Assert: callback receives note_id
  expect(deletedId).toBe(1)
})

test('calls onEdit with the full note object when edit is clicked', async ({ mount }) => {
  let editedNote: Note | undefined

  // Mount with edit callback
  const component = await mount(
    <NoteCard
      note={sampleNote}
      onDelete={() => {}}
      onEdit={(note) => {
        editedNote = note
      }}
    />
  )

  // Act: click edit
  await component.getByTestId('edit-button').click()
  // Assert: callback receives full note
  expect(editedNote?.note_id).toBe(1)
  expect(editedNote?.title).toBe('Sample Note')
})
