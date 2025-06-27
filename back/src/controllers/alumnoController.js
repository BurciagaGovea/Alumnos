import * as service from '../services/alumnoService.js';

import { Op } from 'sequelize';
import { Alumno } from '../models/Alumno.js';

export const list = async (req, res) => {
  try {
    const { search, sexo } = req.query;

    // Construyo WHERE dinámico
    const where = {};
    if (search) {
      where[Op.or] = [
        { matricula:    { [Op.like]: `%${search}%` } },
        { nombre:       { [Op.like]: `%${search}%` } },
        { aPaterno:     { [Op.like]: `%${search}%` } },
        { aMaterno:     { [Op.like]: `%${search}%` } }
      ];
    }
    if (sexo) {
      where.sexo = sexo;  // '1' o '2'
    }

    const alumnos = await Alumno.findAll({ where });
    res.json({ status: 200, data: alumnos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status:500, message:'Server Error' });
  }
};

export const getOne = async (req, res, next) => {
  const a = await service.getById(req.params.matricula);
  if (!a) return res.status(404).json({ status: 404, message: 'No existe' });
  res.json({ status: 200, results: [a] });
};

export const add = async (req, res, next) => {
  const nuevo = await service.create(req.body);
  res.status(201).json({ status: 201, results: [nuevo] });
};

export const edit = async (req, res, next) => {
  await service.update(req.params.matricula, req.body);
  res.json({ status: 200, message: 'Actualizado' });
};

export const remove = async (req, res, next) => {
  const borrado = await service.remove(req.params.matricula);
  if (!borrado) return res.status(404).json({ status: 404, message: 'No existe' });
  res.json({ status: 200, message: 'Eliminado' });
};

export const search = async (req, res, next) => {
  const resultados = await service.searchByName(req.params.nombre);
  res.json({ status: 200, results: resultados });
};
