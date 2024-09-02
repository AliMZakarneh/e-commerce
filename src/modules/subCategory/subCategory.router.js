import { Router } from "express";
import * as subCategoryController from "./subCategory.controller.js";
import fileUpload, { fileValidation } from "../../services/multer.js";


const router = Router({mergeParams:true});

router.get('/',subCategoryController.getsubCategories);

router.post('/',fileUpload(fileValidation.image).single('image'),
subCategoryController.createSubCategory);




export default router;