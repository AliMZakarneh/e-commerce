import jwt from 'jsonwebtoken';
import userModel from '../DB/Model/user.model.js';

export const roles = {
    Admin:'Admin',User:'User',Hr:'Hr'
}


export const auth = (accessRoles = [])=>{
    return async (req,res,next)=>{
        const {authorization} = req.headers;
        if(!authorization?.startsWith(process.env.BEARERKEY)){
            return res.status(400).json({message:"invalid authorization"})
        }
        const token = authorization.split(process.env.BEARERKEY)[1];
        const decoded = jwt.verify(token,process.env.LOGINSECRET);
        if(!decoded){
            return res.status(400).json({message:"invalid authorization"});
        }
        
        const user = await userModel.findById(decoded.id).select('userName role changePasswordTime');
        if(!user){
            return res.status(404).json({message:"not registed user"});
        }
      
        if(parseInt(user.changePasswordTime?.getTime()/1000) > decoded.iat){
            return next(new Error('expired token',{cause:400}));
        }
        if(!accessRoles.includes(user.role)){
            return res.status(403).json({message:"not auth user"});
        }
        
        req.user = user;
        next();
    }
}