import mongoose,{Schema,model} from "mongoose";

const userSchema = new Schema({
    userName:{
        type:String,
        required:true,
        min:4,
        max:20,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    image:{
        type:Object,
        required:true,

    },
    phone:{
        type:String,
    },
    address:{
        type:String,
    },
    confirmEmail:{
        type:String,
        default:false,
    },
    gender:{
        type:String,
        enum:['Male','Female'],
    },
    statue:{
        type:String,
        default:'active',
        enum:['active','inactive'],
    },
    role:{
        type:String,
        default:'User',
        enum:['User','Admin'],
    },

},
{timestamps:true},
);

const userModel = mongoose.model.User || model('User',userSchema);
export default userModel;