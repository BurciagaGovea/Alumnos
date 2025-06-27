// src/middlewares/validate.js
import { body, validationResult } from 'express-validator';

export const validateAlumno = [
  // Datos generales
  body('matricula')
    .notEmpty().withMessage('La matrícula es obligatoria')
    .isAlphanumeric().withMessage('La matrícula debe ser alfanumérica'),
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
  body('aPaterno')
    .notEmpty().withMessage('El apellido paterno es obligatorio'),
  body('aMaterno')
    .optional(),

  // Sexo como tinyint 1 o 2
  body('sexo')
    .notEmpty().withMessage('El sexo es obligatorio')
    .isInt({ min: 1, max: 2 }).withMessage('El sexo debe ser 1 (Masculino) o 2 (Femenino)'),

  // Contacto principal
  body('aTelefono')
    .optional()
    .matches(/^[0-9]{7,12}$/).withMessage('Teléfono inválido'),
  body('aCorreo')
    .notEmpty().withMessage('El correo es obligatorio')
    .isEmail().withMessage('Debe ser un correo válido'),

  // Redes sociales
  body('aFacebook')
    .optional()
    .isURL().withMessage('Facebook debe ser una URL válida'),
  body('aInstagram')
    .optional(),

  // Salud y credenciales
  body('tiposangre')
    .optional()
    .isLength({ min: 1, max: 3 }).withMessage('Tipo de sangre inválido'),
  body('contrasenha')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

  // Dirección
  body('dCalle')
    .optional(),
  body('dNumero')
    .optional()
    .isInt().withMessage('Número inválido'),
  body('dColonia')
    .optional(),
  body('dCodigoPostal')
    .optional()
    .isInt().withMessage('Código postal inválido'),

  // Contacto de emergencia
  body('nombreContacto')
    .optional()
    .isLength({ min: 2 }).withMessage('Nombre de contacto inválido'),
  body('telefonoContacto')
    .optional()
    .matches(/^[0-9]{7,15}$/).withMessage('Teléfono de contacto inválido'),

  // Manejo de errores
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        errors: errors.array().map(err => ({ field: err.param, message: err.msg }))
      });
    }
    next();
  }
];