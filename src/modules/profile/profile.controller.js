import userModel from "../../DB/Model/user.model.js";
import xlsx from 'xlsx';
import { creatPdf } from "../../services/pdf.js";


export const getProfile = async(req,res)=>{
    const user = await userModel.findById(req.user._id);
    return res.status(200).json({message:"success",user});
}

export const uploadUserExcel = async(req,res,next)=>{
    const workBock = xlsx.readFile(req.file.path);
    const workSheet = workBock.Sheets[workBock.SheetNames[0]];
    const users = xlsx.utils.sheet_to_json(workSheet);
    if(!await userModel.insertMany(users)){
        return next(new Error('Could not insert',{cause:400}));
    }
    return res.status(201).json({message:"success"});
}

export const getUsers = async (req,res,next)=>{
    let users = await userModel.find({}).lean();
    await creatPdf(users,'listUsers.pdf');
    return res.status(200).json({message:"success",users});
}

