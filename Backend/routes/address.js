import express from 'express';
import * as AddressController from '../controller/addressController.js';
import * as middleware from '../utils/middlewares.js';

const router = express.Router();

// all routers used are here
router.post('/create', middleware.AuthRequest, AddressController.createAddress);
router.get('/list', middleware.AuthRequest, AddressController.listAddresses);
router.put('/update/:id', middleware.AuthRequest, AddressController.updateAddress);
router.delete('/delete/:id', middleware.AuthRequest, AddressController.deleteAddress);

export default router;