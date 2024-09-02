import cartModel from "../../DB/Model/cart.model.js"
import couponModel from "../../DB/Model/coupon,model.js";
import orderModel from "../../DB/Model/order.model.js";
import productModel from "../../DB/Model/product.model.js";
import userModel from "../../DB/Model/user.model.js";

export const createOrder = async (req,res,next)=>{
   
   //check carts
   const {couponName} = req.body;
   const Cart = await cartModel.findOne({userId:req.user._id});
   if(!Cart){
        return next(new Error('cart is empty',{cause:400}));
   }
   req.body.products = Cart.products;

   //check coupon
   if(couponName){
      const coupon = await couponModel.findOne({name:couponName});
      if(!coupon){
         return next(new Error('coupon not found',{cause:404}));
        
      }
   const currentDate = new Date();
   if(coupon.expireDate <= currentDate){
      return next(new Error('this coupon has expired',{cause:400}));
   }
   if(coupon.usedBy.includes(req.user._id)){
      return next(new Error('coupon already used',{cause:409}));
   }
   req.body.coupon = coupon;
}

//check product
let subtotals = 0;
let finalProductList = []; 
for(let product of req.body.products){
   const checkProduct = await productModel.findOne({
      _id:product.productId,
      stock:{$gte:product.quantity},
   });
   if(!checkProduct){
      return next(new Error('product quantity not available'))
   }

   product = product.toObject();
   product.name = checkProduct.name;
   product.unitePrice = checkProduct.price;
   product.discount = checkProduct.discount;
   product.finalPrice = product.quantity * checkProduct.finalPrice;
   subtotals += product.finalPrice
   finalProductList.push(product);
}

const user = await userModel.findById(req.user._id);
if(!req.body.address){
   req.body.address = user.address;
}
if(!req.body.phone){
   req.body.phone = user.phone
}

const order = await orderModel.create({
   userId:req.user._id,
   products:finalProductList,
   finalPrice:subtotals - (subtotals * (req.body.coupon?.amount || 0)/100),
   address:req.body.address,
   phoneNumber:req.body.phone,
   couponName:req.body.couponName??'',

})

for(const product of req.body.products){
   
   await productModel.updateOne({_id:product.productId},{$inc:{stock: -product.quantity}});
}
if(req.body.coupon){
   await couponModel.updateOne({_id:req.body.coupon._id},{$addToSet:{usedBy:req.user._id}});
}

await cartModel.updateOne({userId:req.user._id},{
   products:[],
});
   return res.status(201).json({message:'success',order});
}

export const cancelOrder = async (req,res,next)=>{
   const {orderId} = req.params;
   const order = await orderModel.findOne({_id:orderId,userId:req.user._id});
   if(!order){
      return next(new Error('invalid order',{cause:404}));
   }
   if(order.status!='pending'){
      return next(new Error('cant cancel this order'))
   }
   req.body.status = 'cancelled';
   req.body.updatedBy = req.user._id;
   const newOrder = await orderModel.findByIdAndUpdate(orderId,req.body,{new:true});

   for(const product of order.products){
      await productModel.updateOne({_id:product.productId},{$inc:{stock:product.quantity}});
   }

   if(req.body.coupon){
      await couponModel.updateOne({_id:req.body.coupon._id},{$pull:{usedBy:req.user._id}});
   }
   return res.json({message:"success",order:newOrder});




}

export const getOrders = async(req,res,next)=>{
   const orders = await orderModel.find({userId:req.user._id});
   return res.status(200).json({message:"success",orders});
}

export const changeStatus = async(req,res,next)=>{
   const {orderId} = req.params;
   const order = await orderModel.findById(orderId);
   if(!order){
      return next(new Error('order not found',{cause:404}));
   }
   if(order.status=='cancelled' || order.status=='deliverd'){
      return next(new Error('cant change status this order'));
   }
   const newOrder = await orderModel.findByIdAndUpdate(orderId,
      {status:req.body.status},{new:true}
   );
   if(req.body.status=='cancelled'){
      for(const product of order.products){
         await productModel.updateOne({_id:product.productId},{$inc:{stock:product.quantity}})
      }
      if(order.couponName){
         await couponModel.updateOne({name:order.couponName},{$pull:{usedBy:order.userId}});
      }
   }
   return res.json({message:"success",order:newOrder});

}