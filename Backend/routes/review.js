import express from 'express';
import * as ReviewController from '../controller/reviewController.js';
import * as middleware from '../utils/middlewares.js';

const router = express.Router();

// all routers used are here
router.post('/create', middleware.AuthRequest,  ReviewController.createReview);
router.delete('/delete/:id', middleware.AuthRequest,  ReviewController.deleteReview);

export default router;