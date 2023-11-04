import multer from 'multer';

export const fileValidation = {
    image:['image/png','image/jpeg','image/webg','image/jpg'],
    pdf:['application/pdf']
}

function fileUpload(customValidation = []){
    const storage = multer.diskStorage({});
    function filefilter(req,file,cb){
        if(customValidation.includes(file.mimeType)){
            cb(null,true)
        }
        else{
            cb('invalid format',false)
        }
    }

    const upload = multer({filefilter,storage});
    return upload;
}

export default fileUpload;