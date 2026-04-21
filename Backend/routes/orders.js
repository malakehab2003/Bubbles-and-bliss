import express from 'express';
import * as OrderController from '../controller/orderController.js';
import * as middleware from '../utils/middlewares.js';

const router = express.Router();

// all routers used are here
router.post('/create', middleware.AuthRequest, OrderController.createOrder);
router.get('/getMyorders', middleware.AuthRequest, OrderController.listUserOrders);
router.get('/getOrders', middleware.AuthRequest, middleware.roleAuth(["admin"]), OrderController.getOrders);
router.get('/getOrder/:id', middleware.AuthRequest, OrderController.getOrder);
router.put('/updateOrder/:id', middleware.AuthRequest, middleware.roleAuth(["admin"]), OrderController.updateOrder);

export default router;