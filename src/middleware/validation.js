import joi from 'joi';
export const generalFields = {
    email:joi.string().email().min(5).required().messages({
        'string.email':"plz enter valid email",
        'string.empty':"email is required"
    }),
    password:joi.string().min(3).required().messages({
        'string.empty':"password is required"
    }),
    file:joi.object({
        fieldname:joi.string().required(),
        originalname:joi.string().required(),
        encoding:joi.string().required() ,
        mimetype:joi.string().required() ,
        destination: joi.string().required(),
        filename: joi.string().required(),
        path:joi.string().required(),
        size:joi.number().positive().required(),
        dest:joi.string(),
    }),
}



export const validation = (schema)=>{
    return (req,res,next)=>{
        const inputsData ={...req.body,...req.params,...req.query};
        if(req.file || req.files){
            inputsData.file = req.file || req.files;
        }
        const validationResult = schema.validate(inputsData,{abortEarly:false});
        if(validationResult.error?.details){
            return res.status(400).json({message:"validation error",
                validationError:validationResult.error?.details})
        }
        next();
    }
}