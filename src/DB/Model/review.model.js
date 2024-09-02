import mongoose , {Schema,Types,model} from 'mongoose';

const reviewSchema = new Schema({
    comment:{
        type:String,
        required:true,
    },
    rating:{type:Number,reuired:true,min:1,max:5},
    createdBy:{type:Types.ObjectId,ref:'User',reqired:true},
    productId:{type:Types.ObjectId,ref:'Product',reqired:true},
    orderId:{type:Types.ObjectId,ref:'Order',reqired:true},

},
    {timestamps:true}
);

const reviewModel = mongoose.models.Review || model('Review',reviewSchema);
export default reviewModel;

