import mongoose, { Schema, Types } from 'mongoose';

const brandSchema = new Schema({
    name:{
        type:Sting,
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
        default:'Active',
        enum:['Active','inactive'],
    },
    createdBy:{type:Types.ObjectId,ref:'User',required:true},
    updatedBy:{type:Types.ObjectId,ref:'User',required:true},
},
{timestamps:true}
);

const brandModel = mongoose.models.Brand || model('Brand',brandSchema);
export default brandModel;