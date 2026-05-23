import express from 'express';
import * as DashboardController from '../controller/dashboardController.js';
import * as middleware from '../utils/middlewares.js';

const router = express.Router();

// public — للـ homepage بدون auth
router.get('/featured-products', DashboardController.getFeaturedProducts);

// admin only
router.get('/', middleware.AuthRequest, middleware.roleAuth(["admin"]), DashboardController.getDashboard);
router.get('/month-orders', middleware.AuthRequest, middleware.roleAuth(["admin"]), DashboardController.getMonthOrders);

export default router;