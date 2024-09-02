import {Router} from 'express';
import * as categoriesController from './categories.controller.js';
import fileUpload, { fileValidation } from '../../services/multer.js';
import subCategoryRouter from '../subCategory/subCategory.router.js';
import { auth, roles } from '../../middleware/auth.js';
import { endPoint } from './categories.endpoint.js';
import { validation } from '../../middleware/validation.js';
import * as validators from './category.validation.js';
import { asyncHandler } from '../../services/errorHandling.js';
const router = Router();

router.post('/',auth(endPoint.create),fileUpload(fileValidation.image).single('image'),
validation(validators.createCategory),asyncHandler(categoriesController.createCategory));
router.use('/:id/subCategory',subCategoryRouter);
router.get('/',auth(endPoint.getAlls),asyncHandler(categoriesController.getCategories));
router.get('/active',asyncHandler(categoriesController.getActiveCategory));
router.get('/:id',validation(validators.getSpecificCategory),asyncHandler(categoriesController.getSpecificCategory));
router.put('/:id',auth(endPoint.update),fileUpload(fileValidation.image).single('image'),asyncHandler(categoriesController.updateCategory));
router.delete('/:categoryId',auth(endPoint.delete),asyncHandler(categoriesController.deleteCategory));

export default router;