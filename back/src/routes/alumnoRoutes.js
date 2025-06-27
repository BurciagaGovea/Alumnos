import { Router } from 'express';
import * as ctrl from '../controllers/alumnoController.js';
import { validateAlumno } from '../middlewares/validate.js';

const router = Router();

router.get('/', ctrl.list);

router.get('/:matricula', ctrl.getOne);
router.post('/', validateAlumno, ctrl.add);
router.put('/:matricula', validateAlumno, ctrl.edit);
router.delete('/:matricula', ctrl.remove);
router.get('/buscar/:nombre', ctrl.search);

export default router;
