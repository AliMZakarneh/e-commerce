import {Router} from 'express';
import * as authController from './auth.controller.js';
import fileUpload, { fileValidation } from '../../services/multer.js';
import {asyncHandler} from '../../services/errorHandling.js'
const router = Router();

router.post('/signup',fileUpload(fileValidation.image).single('image'),asyncHandler(authController.signup));
router.post('/signin',asyncHandler(authController.signin));
router.get('/confirmEmail/:token',asyncHandler(authController.confirmEmail));
router.patch('/sendCode',asyncHandler(authController.sendCode));
router.patch('/forgetPassword',asyncHandler(authController.forgetPassword));

export default router;