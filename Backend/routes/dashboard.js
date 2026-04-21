import express from 'express';
import * as DashboardController from '../controller/dashboardController.js';
import * as middleware from '../utils/middlewares.js';

const router = express.Router();

// all routers used are here
router.get('/', middleware.AuthRequest, middleware.roleAuth(["admin"]), DashboardController.getDashboard);
router.get('/month-orders', middleware.AuthRequest, middleware.roleAuth(["admin"]), DashboardController.getMonthOrders);


export default router;