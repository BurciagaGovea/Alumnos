// src/controllers/mensajeController.js
import { Mensaje } from '../models/Mensaje.js';

export const createMessage = async (req, res) => {
    const emisor = req.user.sub;
    const { receptor, asunto, cuerpo } = req.body;
  
    // 1) Campos obligatorios
    if (!receptor || !asunto || !cuerpo) {
      return res.status(400).json({ message: 'Receptor, asunto y cuerpo son obligatorios' });
    }
  
    // 2) Validar que la matrícula receptor exista
    const alumnoReceptor = await Alumno.findByPk(receptor);
    if (!alumnoReceptor) {
      return res.status(400).json({ message: 'La matrícula receptor no existe' });
    }
  
    // 3) Crear mensaje
    try {
      const mensaje = await Mensaje.create({ emisor, receptor, asunto, cuerpo });
      return res.status(201).json({ message: 'Mensaje enviado', mensaje });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error interno al enviar mensaje' });
    }
  };

import { Alumno }   from '../models/Alumno.js';

export const getMessages = async (req, res) => {
  const receptor = req.user.sub; // siempre la matrícula
  try {
    const mensajes = await Mensaje.findAll({
      where: { receptor },
      include: [{
        model: Alumno,
        as: 'remitente',
        attributes: ['nombre','aPaterno','aMaterno']
      }],
      order: [['fecha','DESC']]
    });

    // Construimos un array plano con el nombre completo del emisor
    const result = mensajes.map(m => ({
      id: m.id,
      remiteNombre: 
         `${m.remitente.nombre} ${m.remitente.aPaterno} ${m.remitente.aMaterno}`,
      asunto: m.asunto,
      cuerpo: m.cuerpo,
      fecha: m.fecha
    }));

    return res.json({ mensajes: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al obtener mensajes' });
  }
};
