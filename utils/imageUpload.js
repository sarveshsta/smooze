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

const storage1 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/UserImages'));
    },
    filename: (req, file, cb) => {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    },
});

const storage2 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/EventImages'));
    },
    filename: (req, file, cb) => {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    },
});


const upload = multer({ storage: storage }).fields([{ name: 'Club_Banner', maxCount: 1 }, { name: 'Club_Docs', maxCount: 1 }, { name: 'Owner_Aadhar', maxCount: 1 }, { name: 'Owner_DP', maxCount: 1 }]);
const upload1 = multer({ storage: storage1 }).fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }]);
const upload2 = multer({ storage: storage1 }).fields([{ name: 'addphotos', maxCount: 1 }]);

module.exports = upload;
module.exports = upload1;
module.exports = upload2;
