import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import mensajeRoutes from './routes/mensajeRoutes.js';
import alumnoRoutes from './routes/alumnoRoutes.js';
import { verifyToken } from './middlewares/auth.js';

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

//rutas públicas de autenticación
app.use('/auth', authRoutes);

//rutas protegidas de alumnos
app.use('/alumnos', verifyToken, alumnoRoutes);
app.use('/mensajes', verifyToken, mensajeRoutes);

//rutas no encontradas
app.use((req, res) => res.status(404).json({ status: 404, message: 'Not Found' }));

//errores generales
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ status: 500, message: 'Server Error' });
});

export default app;
