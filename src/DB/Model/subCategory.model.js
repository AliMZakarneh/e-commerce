import mongoose,{Schema,Types,model} from "mongoose";

const subCategorySchema = new Schema ({
    name:{
        type:String,
        required:true,
        unique:true
    },
    slug:{
        type:String,
        required:true,
    },
    image:{
        type:Object,
        required:true,
    },
    status:{
        type:String,
        default:'active',
        enum:['active','inactive'],
    },
    categoryId:{type:Types.ObjectId,ref:'category',required:true},
    createdBy:{type:Types.ObjectId,ref:'User'},
    updatedBy:{type:Types.ObjectId,ref:'User'},

},
    {timestamps:true,},
);

const subCategoryModel = mongoose.models.subCategory || model('subCategory',subCategorySchema);
export default subCategoryModel;