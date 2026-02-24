import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { sequelize } from './models/index.js'
import router from './routes/routes.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
)
app.use(express.json())
app.use(cookieParser())

app.use('/api', router)

// Health check - used by Docker Compose
app.get('/health', (req, res) => res.json({ status: 'ok' }))

const start = async () => {
  // force:true recreates tables on every start in dev/test - clean slate
  await sequelize.sync({ force: process.env.NODE_ENV !== 'production' })
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
}

start().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})

export default app
