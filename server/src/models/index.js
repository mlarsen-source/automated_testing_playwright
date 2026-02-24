import { sequelize } from '../db/sequelize.js'
import { User } from './User.js'
import { Note } from './Note.js'

User.hasMany(Note, { foreignKey: 'user_id' })
Note.belongsTo(User, { foreignKey: 'user_id' })

export { sequelize, User, Note }
