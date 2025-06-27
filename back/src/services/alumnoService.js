import { Alumno } from '../models/Alumno.js';
import bcrypt from 'bcryptjs';

export const getAll = () => Alumno.findAll();
export const getById = matricula => Alumno.findByPk(matricula);
export const create = async data => {
  data.contrasenha = await bcrypt.hash(data.contrasenha, 10);
  return Alumno.create(data);
};
export const update = async (matricula, data) => {
  if (data.contrasenha) {
    data.contrasenha = await bcrypt.hash(data.contrasenha, 10);
  }
  return Alumno.update(data, { where: { matricula } });
};
export const remove = matricula => Alumno.destroy({ where: { matricula } });
export const searchByName = nombre =>
  Alumno.findAll({ where: { nombre: { [Op.like]: `%${nombre}%` } } });
