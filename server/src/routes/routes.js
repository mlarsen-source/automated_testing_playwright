import { Router } from 'express'
import { register, login, logout } from '../controllers/authController.js'
import { getNotes, createNote, updateNote, deleteNote } from '../controllers/noteController.js'
import { authenticate } from '../middleware/authenticate.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)

router.get('/notes', authenticate, getNotes)
router.post('/notes', authenticate, createNote)
router.put('/notes/:id', authenticate, updateNote)
router.delete('/notes/:id', authenticate, deleteNote)

export default router
