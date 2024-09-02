import multer from 'multer';

export const fileValidation = {
    image:['image/png','image/jpeg','image/webg','image/jpg'],
    pdf:['application/pdf'],
    excel:['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
}

function fileUpload(customValidation = []){
    const storage = multer.diskStorage({});
    function filefilter(req,file,cb){
        console.log(file);
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