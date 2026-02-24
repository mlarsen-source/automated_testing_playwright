import { DataTypes } from 'sequelize'
import { sequelize } from '../db/sequelize.js'

export const Note = sequelize.define(
  'Note',
  {
    note_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING(255), allowNull: false },
    content: { type: DataTypes.TEXT },
  },
  { tableName: 'notes', timestamps: true }
)
