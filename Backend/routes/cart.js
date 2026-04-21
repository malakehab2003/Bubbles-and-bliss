import express from 'express';
import * as CartController from '../controller/cartController.js';
import * as middleware from '../utils/middlewares.js';

const router = express.Router();

// all routers used are here
router.get('/list', middleware.AuthRequest,  CartController.listCart);
router.put('/update/quantity', middleware.AuthRequest,  CartController.updateQuantity);
router.post('/addProduct', middleware.AuthRequest,  CartController.addProduct);
router.delete('/delete/:id', middleware.AuthRequest,  CartController.deleteProduct);

export default router;