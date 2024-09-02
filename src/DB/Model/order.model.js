import mongoose , {Schema,Types,model} from 'mongoose';


const orderSchema = new Schema({
    userId:{
        type:Types.ObjectId,ref:'User',required:true
    },
    products:[{
        productId:{type:Types.ObjectId,ref:'Product',required:true},
        quantity:{type:Number,default:1,required:true},
        unitePrice:{type:Number,required:true},
        finalPrice:{}
    }],
    finalPrice:{type:Number,required:true},
    address:{type:String},
    phoneNumber:{type:String},
    couponName:{type:String},
    paymentType:{type:String,default:'cash',enum:['cash','cart']},
    status:{
        type:String,
        default:'pending',
        enum:['pending','cancelled','confirmed','onWay','deliverd']
    },
    reasonRejected:String,
    note:String,
    updatedBy:{type:Types.ObjectId,ref:'User'},
},
{timestamps:true},
);

const orderModel = mongoose.models.Order || model('Order',orderSchema);
export default orderModel;
