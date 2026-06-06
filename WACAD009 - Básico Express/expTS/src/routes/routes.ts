import { Router } from 'express';
import MainController from '../controllers/MainController.js';

const router = Router();

router.get('/', MainController.home);

router.get('/lorem/:quantidade', MainController.lorem);

router.get('/hb1', MainController.hb1);

router.get('/hb2', MainController.hb2);

router.get('/hb3', MainController.hb3);

router.get('/hb4', MainController.hb4);

export default router;