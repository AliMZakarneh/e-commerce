import mongoose,{Schema,Types,model} from "mongoose";

const categorySchema = new Schema({
    name:{
        type:String,
        required:true,
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
    CreatedBy:{type:Types.ObjectId,ref:'User'},
    updatedBy:{type:Types.ObjectId,ref:'User'},

},
{timestamps:true},
);

const categoryModel = mongoose.model.Category || model('Category',categorySchema);
export default categoryModel;