import express from 'express';
import * as PromocodeController from '../controller/promocodeController.js';
import * as middleware from '../utils/middlewares.js';

const router = express.Router();

// all routers used are here
router.post('/create', middleware.AuthRequest, middleware.roleAuth(["admin"]), PromocodeController.createPromocode);
router.delete('/delete/:id', middleware.AuthRequest, middleware.roleAuth(["admin"]), PromocodeController.deletePromocode);
router.get('/list', middleware.AuthRequest, middleware.roleAuth(["admin"]), PromocodeController.listPromocodes);
router.put('/update/:id', middleware.AuthRequest, middleware.roleAuth(["admin"]), PromocodeController.updatePromocode);
router.post('/apply', middleware.AuthRequest, PromocodeController.applyPromocode);
router.post('/send-promocodes', middleware.AuthRequest, middleware.roleAuth(["admin"]), PromocodeController.sendPromocodeToUsers);

export default router;