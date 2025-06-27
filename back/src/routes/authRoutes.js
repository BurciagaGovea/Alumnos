import { Router } from 'express';
import { login, loginWithGoogle, register, me } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();

//login local
router.post('/login', login);

//registro local
router.post('/register', register);

//login con Google
router.post('/google', loginWithGoogle);

router.get('/me', verifyToken, me);

export default router;
