import bcrypt from 'bcryptjs';
import cloudinary from '../../services/cloudinary.js';
import userModel from '../../DB/Model/user.model.js';
import jwt from 'jsonwebtoken';

export const signup = async(req,res)=>{
const {userName,email,password} = req.body;

const user = await userModel.findOne({email});
if(user){
    return res.status(409).json({message:"email already exists"});
}

const hashedPassword = bcrypt.hashSync(password,parseInt(process.env.SALTROUND));
const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{
    folder:`${process.env.APP_NAME}/users`
});

const createUser = await userModel.create({email,password:hashedPassword,userName,image:{secure_url,public_id}});

return res.status(201).json({message:"success",createUser});


}

export const signin = async(req,res)=>{
    const{email,password} = req.body;

    const user = await userModel.findOne({email});
    if(!user){
        return res.status(402).json({message:'invalid data'});
    }
    const match = bcrypt.compareSync(password,user.password);
    if(!match){
        return res.status(402).json({message:'invalid data'});
    }

    var token = jwt.sign({ id:user._id,role:user.role,status:user.status },process.env.LOGINSECRET,
         { expiresIn:60*5 });
    var refreshToken = jwt.sign({ id:user._id,role:user.role,status:user.status },process.env.LOGINSECRET,
        { expiresIn:60*60*24*30 });
        
    return res.status(200).json({message:'success',token,refreshToken});
    

}