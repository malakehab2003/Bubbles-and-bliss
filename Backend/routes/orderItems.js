import express from 'express';
import * as OrderItemController from '../controller/orderItemController.js';
import * as middleware from '../utils/middlewares.js';

const router = express.Router();

router.get('/list/:order_id', middleware.AuthRequest, OrderItemController.listItems);
router.get('/admin/list/:order_id', middleware.AuthRequest, middleware.roleAuth(["admin"]), OrderItemController.adminListItems);
router.post('/create', middleware.AuthRequest, OrderItemController.createItems);

export default router;
