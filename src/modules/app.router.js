import categoriesRouter from './categories/categories.router.js';
import productsRouter from './products/product.router.js';
import authRouter from './auth/auth.router.js';
import subCategoryRouter from './subCategory/subCategory.router.js';
import couponRouter from './coupon/coupon.router.js';
import cartRouter from './cart/cart.router.js';
import orderRouter from './order/order.router.js';
import profileRouter from './profile/profile.router.js';
import connectDB from '../DB/connection.js';
import nodemailer from "nodemailer";
import { globalErrorHandler } from '../services/errorHandling.js';
import cors from 'cors';

const initApp = async (app,express)=>{
    app.use(cors());
    app.use(express.json());
    connectDB();
    app.get('/',(req,res)=>{
        return res.json('welcome');
    });
    app.use('/auth',authRouter);
    app.use('/categories',categoriesRouter);
    app.use('/products',productsRouter);
    app.use('/subCategory',subCategoryRouter);
    app.use('/coupon',couponRouter);
    app.use('/cart',cartRouter);
    app.use('/order',orderRouter);
    app.use('/profile',profileRouter);

    app.get('*',(req,res)=>{
        return res.json('page not found');
    });
    app.use(globalErrorHandler);
}

export default initApp;