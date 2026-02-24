import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

// Resolve env file: prefer repo-root/.env; fall back to server/.env
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootEnv = path.resolve(__dirname, '../../../.env')
const serverEnv = path.resolve(__dirname, '../../.env')
const envPath = fs.existsSync(rootEnv) ? rootEnv : serverEnv
dotenv.config({ path: envPath })

export const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || 'notes_db',
  process.env.MYSQL_USER || 'notes_user',
  process.env.MYSQL_PASSWORD || 'notes_pass',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    logging: false,
  }
)
