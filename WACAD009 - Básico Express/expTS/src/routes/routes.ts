import { Router } from 'express';
import MainController from '../controllers/MainController.js';
import ProductController from '../controllers/ProductController.js';

const router = Router();

router.get('/', MainController.home);

router.get('/lorem/:quantidade', MainController.lorem);

router.get('/hb1', MainController.hb1);

router.get('/hb2', MainController.hb2);

router.get('/hb3', MainController.hb3);

router.get('/hb4', MainController.hb4);

router.get('/products', ProductController.list);

router.get('/products/create', ProductController.createForm);

router.post('/products/create', ProductController.create);

router.get('/products/edit/:id', ProductController.editForm);

router.post('/products/edit/:id', ProductController.update);

router.post('/products/delete/:id', ProductController.delete);

export default router;