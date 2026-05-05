import express from 'express';
import * as imageController from '../controller/imageController.js';
import * as middleware from '../utils/middlewares.js';
import { upload } from '../utils/multer.js';

const router = express.Router();

// all routers used are here
router.delete('/delete/:id', middleware.AuthRequest, middleware.roleAuth('admin'), imageController.deleteImage);
router.post('/addImages', upload.array("images", 10), middleware.AuthRequest, middleware.roleAuth('admin'), imageController.addImages);

export default router;