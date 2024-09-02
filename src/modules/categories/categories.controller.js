import slugify from 'slugify';
import cloudinary from '../../services/cloudinary.js';
import categoryModel from '../../DB/Model/category.model.js';
import { pagination } from '../../services/pagination.js';
import productModel from '../../DB/Model/product.model.js';


export const getCategories = async(req,res)=>{
    const {skip,limit} = pagination(req.query.page,req.query.limit);
    const categories = await categoryModel.find().skip(skip).limit(limit).populate('subCategory');
    return res.status(200).json({message:"success",categories});
}

export const getSpecificCategory = async(req,res)=>{
    const {id} = req.params;
    const category = await categoryModel.findById(id);
    return res.json({message:"success",category});
}

export const createCategory = async(req,res,next)=>{
    const name = req.body.name.toLowerCase();
    const category = await categoryModel.findOne({name});
    if(category){
        next(new Error('category name already exist',{cause:409}));
    }
    const slugName = slugify(name);
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,
        {folder:`${process.env.APP_NAME}/categories`}
        );
        const cat = await categoryModel.create({name,slug:slugName,image:{secure_url,public_id}
            ,createdBy:req.user._id,updatedBy:req.user._id});
        return res.status(201).json({message:'success',cat});
}

export const updateCategory = async(req,res,next)=>{
        const category = await categoryModel.findById(req.params.id);
        if(!category){
            next(new Error(`invalid category id ${req.params.id}`,{cause:404}))
        }
        if(req.body.name){
          if(await categoryModel.findOne({name:req.body.name,_id:{$ne:category._id}}).select('name')){
            next(new Error(`category ${req.body.name} already exists`,{cause:409}))
          }  
            category.name = req.body.name;
            category.slug = slugify(req.body.name);
        }
        if(req.body.status){
            category.status = req.body.status;
        }
        if(req.file){
            const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,
                {folder:`${process.env.APP_NAME}/categories`}
                );
                await cloudinary.uploader.destroy(category.image.public_id);
                category.image = {secure_url,public_id}
        }
        category.updatedBy = req.user._id;
        await category.save();
         return res.status(200).json({message:'success',category});
}

export const getActiveCategory = async(req,res)=>{

    const {skip,limit} = pagination(req.query.page,req.query.limit);
    const categories = await categoryModel.find({status:'active'}).skip(skip).limit(limit).select('name image');
    return res.status(200).json({message:'success',categories});
}

export const deleteCategory = async(req,res,next)=>{
    const {categoryId} = req.params;
    console.log(req.params);
    const category = categoryModel.findByIdAndDelete(categoryId);
    if(!category){
        return next(new Error('category not found',{cause:404}));
    }
    await productModel.deleteMany({categoryId});
    return res.status(200).json({message:"success"});
}