import slugify from "slugify";
import categoryModel from "../../DB/Model/category.model.js";
import subCategoryModel from "../../DB/Model/subCategory.model.js";
import cloudinary from "../../services/cloudinary.js";

export const  createSubCategory = async(req,res)=>{
    try{
        const {name,categoryId} = req.body;
    const subcategory = await subCategoryModel.findOne({name});
    if(subcategory){
        return res.status(409).json({message:`sub category ${name} already exists`});}
    const category = await categoryModel.findById(categoryId);
    if(!category){
        return res.status(404).json({message:"category not found"});}
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,
        {folder:`${process.env.APP_NAME}/subCategories`}   );
    const subCategory = await subCategoryModel.create({name,slug:slugify(name),image:{secure_url,public_id},categoryId});
    return res.status(201).json({message:"success",subCategory});
    }
    catch(error){
        return res.json(error);
    }
}

export const getsubCategories = async(req,res)=>{
    const categoryId = req.params.id;
    const category = await categoryModel.findById(categoryId);
    if(!category){
        return res.status(404).json({message:"category not found"});
    }

    const subCategories = await subCategoryModel.find({categoryId});

    return res.status(200).json({message:"success",subCategories}); 


}