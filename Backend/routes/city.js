import express from 'express';
import * as CityController from '../controller/cityController.js';

const router = express.Router();

// all routers used are here
router.get('/list', CityController.listCity);
router.get('/get/:id', CityController.getCity);

export default router;