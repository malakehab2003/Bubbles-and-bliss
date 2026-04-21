import express from 'express';
import * as ProductController from '../controller/productController.js';
import * as middleware from '../utils/middlewares.js';

const router = express.Router();

// all routers used are here
router.get('/list', ProductController.listProducts);
router.get('/getProduct/:id', ProductController.getProudct);
router.post('/create', middleware.AuthRequest, middleware.roleAuth(['admin']), ProductController.createProduct);
router.put('/update/:id', middleware.AuthRequest, middleware.roleAuth(['admin']), ProductController.updateProduct);
router.delete('/delete/:id', middleware.AuthRequest, middleware.roleAuth(['admin']), ProductController.deleteProduct);

export default router;