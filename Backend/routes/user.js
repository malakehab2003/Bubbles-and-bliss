import express from 'express';
import * as UserController from '../controller/userController.js';
import * as middleware from '../utils/middlewares.js';

const router = express.Router();

// all routers used are here
router.post('/createUser', UserController.createUser);
router.post('/login', UserController.login);
router.get('/getMe', middleware.AuthRequest, UserController.getMe);
router.put('/update', middleware.AuthRequest, UserController.update);
router.delete('/delete', middleware.AuthRequest, UserController.deleteUser);
router.put('/undoDelete', UserController.undoDelete);
router.post('/logOut',  middleware.AuthRequest, UserController.logOut);
router.put('/chagePassword',  middleware.AuthRequest, UserController.chagePassword);
router.get('/getUser', UserController.getAnotherUser)
router.get('/searchUser', middleware.AuthRequest, middleware.roleAuth(['admin']), UserController.searchUsers)
router.post('/createAdmin', middleware.AuthRequest, middleware.roleAuth(['admin']), UserController.createAdmin)
router.get('/verify-email', UserController.verifyUser);
router.post('/forget-password', UserController.forgetPassword);
router.post('/reset-password', UserController.resetPassword);

export default router;