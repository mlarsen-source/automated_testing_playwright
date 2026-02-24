import { DataTypes } from 'sequelize'
import { sequelize } from '../db/sequelize.js'

export const User = sequelize.define(
  'User',
  {
    user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING(255), unique: true, allowNull: false },
    password_hash: { type: DataTypes.STRING(255), allowNull: false },
    first_name: { type: DataTypes.STRING(100), allowNull: false },
    last_name: { type: DataTypes.STRING(100), allowNull: false },
  },
  { tableName: 'users', timestamps: false }
)
