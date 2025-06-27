// src/models/Alumno.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Alumno = sequelize.define('Alumno', {
  matricula: {
    type: DataTypes.STRING,
    primaryKey: true,
    field: 'matricula'
  },
  aPaterno: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'aPaterno'
  },
  aMaterno: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'aMaterno'
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'nombre'
  },
  sexo: {
    type: DataTypes.TINYINT,    // tinyint en la BD
    allowNull: false,
    field: 'sexo'
  },
    
  dCalle: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'dCalle'
  },
  dNumero: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'dNumero'
  },
  dColonia: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'dColonia'
  },
  dCodigoPostal: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'dCodigoPostal'
  },
  aTelefono: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'aTelefono'
  },
  aCorreo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true },
    field: 'aCorreo'
  },
  aFacebook: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'aFacebook'
  },
  aInstagram: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'aInstagram'
  },
  tiposangre: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'tiposangre'
  },
  nombreContacto: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'nombreContacto'
  },
  telefonoContacto: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'telefonoContacto'
  },
  contrasenha: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'contrasenha'
  },
  foto: {
    type: DataTypes.STRING, // o DataTypes.BLOB si guardas la imagen como binario
    allowNull: true,
    field: 'foto'
  }
}, {
  tableName: 'alumnos',
  timestamps: false
});
