import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { Alumno } from './Alumno.js';  // importamos el modelo Alumno

export const Mensaje = sequelize.define('Mensaje', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  emisor: { type: DataTypes.STRING, allowNull: false },
  receptor: { type: DataTypes.STRING, allowNull: false },
  asunto: { type: DataTypes.STRING, allowNull: false },
  cuerpo: { type: DataTypes.TEXT,   allowNull: false },
  fecha: { type: DataTypes.DATE,   allowNull: false, defaultValue: DataTypes.NOW }
}, {
  tableName: 'mensajes',
  timestamps: false
});

// Asociación: un Mensaje pertenece a un Alumno (emisor)
Mensaje.belongsTo(Alumno, {
  foreignKey: 'emisor',
  targetKey: 'matricula',
  as: 'remitente'
});
