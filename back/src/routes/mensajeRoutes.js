// src/routes/mensajeRoutes.js
import { Router } from 'express';
import { createMessage, getMessages } from '../controllers/mensajeController.js';

const router = Router();

router.post('/', createMessage);
router.get('/', getMessages);

export default router;
