import categoriesRouter from './categories/categories.router.js';
import productsRouter from './products/product.router.js';
import authRouter from './auth/auth.router.js';
import connectDB from '../DB/connection.js';
const initApp = (app,express)=>{
    app.use(express.json());
    connectDB();
    app.get('/',(req,res)=>{
        return res.json('welcome');
    });
    app.use('/auth',authRouter);
    app.use('/categories',categoriesRouter);
    app.use('/products',productsRouter);
    app.get('*',(req,res)=>{
        return res.json('page not found');
    });
}

export default initApp;