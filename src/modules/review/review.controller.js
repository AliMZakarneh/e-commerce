import orderModel from "../../DB/Model/order.model.js";
import reviewModel from "../../DB/Model/review.model.js";

export const create = async(req,res,next)=>{
    const {productId} = req.params;
    const {rating,comment} = req.body;
    const order = await orderModel.findOne({
        userId:req.user._id,
        status:'deliverd',
        "products.productId":productId,
    });
    if(!order){
        return next(new Error('can not review this product',{cause:400}));
    }
    const checkReview = await reviewModel.findOne({
        createdBy:req.user._id,
        productId:productId.toString()
    });
    if(checkReview){
        return next(new Error('already review',{cause:400}));
    }
    const review = await reviewModel.create({
        comment,
        rating,
        createdBy:req.user._id,
        orderId:order._id,
        productId:productId
    });

    if(!review){
        return next(new Error('error while adding review',{cause:400}));

    }
    return res.status(201).json({message:"success",review});
}