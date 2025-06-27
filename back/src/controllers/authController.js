// src/controllers/authController.js
import axios from 'axios';
import https from 'https';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { Alumno } from '../models/Alumno.js';
import { Usuario } from '../models/Usuario.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Agente HTTPS forzando IPv4 (family: 4)
const ipv4Agent = new https.Agent({ family: 4 });

// Verifica el token de reCAPTCHA con Google
async function verifyRecaptcha(token) {
  const secret = process.env.RECAPTCHA_SECRET;
  const resp = await axios.post(
    'https://www.google.com/recaptcha/api/siteverify',
    null,
    {
      params: { secret, response: token },
      httpsAgent: ipv4Agent
    }
  );
  return resp.data.success;
}

// Login local con CAPTCHA
export const login = async (req, res) => {
  const { username, password, recaptchaToken } = req.body;
  if (!recaptchaToken || !await verifyRecaptcha(recaptchaToken)) {
    return res.status(400).json({ message: 'Captcha inválido' });
  }
  try {
    const user = await Usuario.findOne({ where: { username } });
    if (!user) throw new Error();
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) throw new Error();

    const token = jwt.sign(
      { sub: user.username, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    return res.json({ token });
  } catch {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }
};

// Login con Google + CAPTCHA
export const loginWithGoogle = async (req, res) => {
  const { idToken, recaptchaToken } = req.body;
  if (!recaptchaToken || !await verifyRecaptcha(recaptchaToken)) {
    return res.status(400).json({ message: 'Captcha inválido' });
  }
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const email = payload.email;
    const match = email.match(/^[^_]+_(\d+)@utd\.edu\.mx$/);
    if (!match) throw new Error('Formato de correo inválido');
    const matricula = match[1];
    const alumno = await Alumno.findByPk(matricula);
    if (!alumno) throw new Error('No existe la matrícula');

    const token = jwt.sign(
      { sub: alumno.matricula, username: alumno.matricula },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    return res.json({ token });
  } catch {
    return res.status(401).json({ message: 'Error de autenticación con Google' });
  }
};

// Registro local con CAPTCHA
export const register = async (req, res) => {
  const { matricula, contrasenha, recaptchaToken } = req.body;
  if (!recaptchaToken || !await verifyRecaptcha(recaptchaToken)) {
    return res.status(400).json({ message: 'Captcha inválido' });
  }
  if (!matricula || !contrasenha) {
    return res.status(400).json({ message: 'Matrícula y contraseña son obligatorios' });
  }

  const alumno = await Alumno.findByPk(matricula);
  if (!alumno) {
    return res.status(400).json({ message: 'No existe un alumno con esa matrícula' });
  }

  const existe = await Usuario.findOne({ where: { username: matricula } });
  if (existe) {
    return res.status(400).json({ message: 'Usuario ya registrado' });
  }

  const passwordHash = await bcrypt.hash(contrasenha, 10);
  await Usuario.create({ username: matricula, passwordHash });

  return res.status(201).json({ message: 'Usuario registrado correctamente' });
};


export const me = async (req, res) => {
  try {
    // La matrícula que firmaste en el token (sub)
    const matricula = req.user.sub;
    // Buscamos en la tabla alumnos
    const alumno = await Alumno.findByPk(matricula, {
      attributes: [
        'matricula',
        'nombre', 
        'aPaterno', 
        'aMaterno',
        'aCorreo',
        'aTelefono'
      ]
    });
    if (!alumno) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    // Devolvemos un objeto user con los campos que quieras exponer
    res.json({
      user: {
        username: alumno.matricula,
        nombre: `${alumno.nombre} ${alumno.aPaterno}${alumno.aMaterno ? ' ' + alumno.aMaterno : ''}`,
        email: alumno.aCorreo,
        telefono: alumno.aTelefono
      }
    });
  } catch (err) {
    console.error('Error en /auth/me:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};