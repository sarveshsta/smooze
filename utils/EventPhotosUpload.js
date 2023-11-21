const multer = require('multer');
const path = require('path');

const storage2 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/EventImages'));
    },
    filename: (req, file, cb) => {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    },
});

const upload2 = multer({ storage: storage2 }).fields([{ name: 'addphotos', maxCount: 1 },{ name: 'addphotos1', maxCount: 1 },{ name: 'addphotos2', maxCount: 1 }]);

module.exports = upload2;
