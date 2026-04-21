import express from 'express';
import * as GovernmentController from '../controller/governmentController.js';

const router = express.Router();

// all routers used are here
router.get('/list', GovernmentController.listGovernment);
router.get('/get/:id', GovernmentController.getGovernment);

export default router;