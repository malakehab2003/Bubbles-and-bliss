import express from 'express';
import * as OrderItemController from '../controller/orderItemController.js';
import * as middleware from '../utils/middlewares.js';

const router = express.Router();

// all routers used are here
router.get('/list/:order_id', middleware.AuthRequest, OrderItemController.listItems);
router.post('/create', middleware.AuthRequest, OrderItemController.createItems);

export default router;