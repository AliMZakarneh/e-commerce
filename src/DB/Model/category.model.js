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
    createdBy:{type:Types.ObjectId,ref:'User',required:true},
    updatedBy:{type:Types.ObjectId,ref:'User',required:true},

},
{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
},
);
categorySchema.virtual('subCategory',{
    localField:'_id',
    foreignField:'categoryId',
    ref:'subCategory'
});

const categoryModel = mongoose.models.Category || model('Category',categorySchema);
export default categoryModel;