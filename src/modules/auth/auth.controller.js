import bcrypt from 'bcryptjs';
import cloudinary from '../../services/cloudinary.js';
import userModel from '../../DB/Model/user.model.js';
import jwt from 'jsonwebtoken';
import {sendEmail} from '../../services/email.js';
import { customAlphabet, nanoid } from 'nanoid'


export const signup = async(req,res,next)=>{
   
        const {userName,email,password} = req.body;
const user = await userModel.findOne({email});
if(user){
   // return res.status(409).json({message:"email already exists"});
   next(new Error('email already exists',{cause:409}));
}
const hashedPassword = bcrypt.hashSync(password,parseInt(process.env.SALTROUND));
const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{
    folder:`${process.env.APP_NAME}/users`
});
const token = jwt.sign({email},process.env.confirmEmailSecret);
await sendEmail(email,"confirm email",`<a href='${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}'>verify</a>`);
const createUser = await userModel.create({email,password:hashedPassword,userName,image:{secure_url,public_id}});
return res.status(201).json({message:"success",createUser});
   
}

export const signin = async(req,res,next)=>{
    const{email,password} = req.body;

    const user = await userModel.findOne({email});
    if(!user){
        return res.status(400).json({message:'invalid data'});
    }
    if(!user.confirmEmail){
        return res.status(400).json({message:"plz confirm your email"})
    }
    const match = bcrypt.compareSync(password,user.password);
    if(!match){
        return res.status(400).json({message:'invalid data'});
    }
    var token = jwt.sign({ id:user._id,role:user.role,status:user.status },process.env.LOGINSECRET,
         { expiresIn:60*60 });
    var refreshToken = jwt.sign({ id:user._id,role:user.role,status:user.status },process.env.LOGINSECRET,
        { expiresIn:60*60*24*30 });
        
    return res.status(200).json({message:'success',token,refreshToken});
    

}

export const confirmEmail = async(req,res,next)=>{
    const token = req.params.token;
    const decoded = jwt.verify(token,process.env.confirmEmailSecret);
    if(!decoded){
        return res.status(404).json({message:"invalid token"});
    }

    const user = await userModel.findOneAndUpdate({email:decoded.email,confirmEmail:false},
        {confirmEmail:true});
    if(!user){
        return res.status(400).json({message:'invalid verify email or email is verified'});
    }

    return res.status(200).json({message:"your email is verified"});
}

export const sendCode = async(req,res,next)=>{
    const {email} = req.body;
    let code = customAlphabet('12356abcd',8);
    code = code();
    const user = await userModel.findOneAndUpdate({email},{sendCode:code},{new:true});
    const html = `<ht>code is :${code}</ht>`;
    await sendEmail(email,'reset password',html);
    return res.status(200).json({message:"success",user});
    // res.redirect(process.env.sendCodeLink)
}

export const forgetPassword = async(req,res,next)=>{
    const {email,password,code} = req.body;
    const user = await userModel.findOne({email});
    if(!user){
        return res.status(404).json({message:"not register account"});
    }
    if(user.sendCode != code){
        return res.status(409).json({message:"invalid code"});
    }
    const match = await bcrypt.compare(password,user.password);
    if(match){
        return res.status(409).json({message:"same password"});
    }
    user.password = await bcrypt.hash(password,parseInt(process.env.SALTROUND));
    user.sendCode = null;
    user.changePasswordTime = Date.now();
    await user.save();
    return res.status(200).json({message:"success"});
}