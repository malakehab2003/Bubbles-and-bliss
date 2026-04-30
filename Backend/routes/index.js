import express from 'express';
import userRouter from './user.js';
import addressRouter from './address.js';
import productRouter from './product.js';
import productImageRouter from './productImage.js';
import governmentRouter from './government.js';
import cityRouter from './city.js';
import cartRouter from './cart.js';
import wishlistRouter from './wishlist.js';
import orderRouter from './orders.js';
import orderItemRouter from './orderItems.js';
import reviewController from './review.js';
import promocodeController from './promocode.js';
import dashboardController from './dashboard.js';

const router = express.Router();

// all routers used are here
router.use('/user', userRouter);
router.use('/address', addressRouter);
router.use('/product', productRouter);
router.use('/product/image/', productImageRouter);
router.use('/government', governmentRouter);
router.use('/city', cityRouter);
router.use('/cart', cartRouter);
router.use('/wishlist', wishlistRouter);
router.use('/order', orderRouter);
router.use('/order/item', orderItemRouter);
router.use('/review', reviewController);
router.use('/promocode', promocodeController);
router.use('/dashboard', dashboardController);

export default router;