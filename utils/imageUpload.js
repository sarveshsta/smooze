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
