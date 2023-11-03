const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
            cb(null, path.join(__dirname, '../public/uploads'));
        }
        else {
            cb(null, path.join(__dirname, '../public/documents'));
        }
    },
    filename: (req, file, cb) => {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    },
});


const upload = multer({ storage: storage }).fields([{ name: 'Club_Banner', maxCount: 1 }, { name: 'Club_Docs', maxCount: 1 }, { name: 'Owner_Aadhar', maxCount: 1 }, { name: 'Owner_DP', maxCount: 1 }]);

module.exports = upload;




// const fileFilter = (req,file,cb)=>{
//     if(file.fieldname === 'Club_Banner' || file.fieldname === 'Owner_DP' || file.fieldname === 'Owner_Aadhar' ){
//         (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') ? cb(null,true) : cb(null,false);
//     }
//     else if(file.fieldname === 'Club_Docs'){
//         (file.mimetype === 'application/msword' || file.mimetype === 'application/pdf' || file.mimetype === 'application/docx')? cb(null,true) : cb(null,false);
//     }
// }
// const fileFilter = (req, file, cb) => {
//     if (file.fieldname === 'Club_Banner') {
//         (file.mimetype === 'Club_Banner/jpeg' || file.mimetype === 'Club_Banner/jpg' || file.mimetype === 'Club_Banner/png') ? cb(null, true) : cb(null, false);
//     } else if (file.fieldname === 'Owner_DP') {
//         (file.mimetype === 'Owner_DP/jpeg' || file.mimetype === 'Owner_DP/jpg' || file.mimetype === 'Owner_DP/png') ? cb(null, true) : cb(null, false);
//     }
//     else if (file.fieldname === 'Owner_Aadhar') {
//         (file.mimetype === 'Owner_Aadhar/jpeg' || file.mimetype === 'Owner_Aadhar/jpg' || file.mimetype === 'Owner_Aadhar/png') ? cb(null, true) : cb(null, false);
//     }
//     else if (file.fieldname === 'Club_Docs') {
//         (file.mimetype === 'application/msword' || file.mimetype === 'application/pdf' || file.mimetype === 'application/docx') ? cb(null, true) : cb(null, false);
//     } else {
//         cb(null, false);
//     }
// }
