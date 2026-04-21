import express from 'express';
import * as WishlistController from '../controller/wishlistController.js';
import * as middleware from '../utils/middlewares.js';

const router = express.Router();

// all routers used are here
router.get('/list', middleware.AuthRequest,  WishlistController.listWishlist);
router.post('/addProduct', middleware.AuthRequest,  WishlistController.addProduct);
router.delete('/delete/:product_id', middleware.AuthRequest,  WishlistController.deleteProduct);

export default router;