import express from 'express';
import * as ReviewController from '../controller/reviewController.js';
import * as middleware from '../utils/middlewares.js';
import { upload } from '../utils/multer.js';

const router = express.Router();

// all routers used are here
router.post('/create', middleware.AuthRequest, upload.single("image"),  ReviewController.createReview);
router.delete('/delete/:id', middleware.AuthRequest,  ReviewController.deleteReview);

export default router;