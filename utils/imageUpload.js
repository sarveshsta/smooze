const multer = require('multer');
const path = require('path');

const Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/uploads');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    },
});

const imageFilter = (req, file, cb) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.jpg'];
    const ext = path.extname(file.originalname).toLowerCase();
  
    if (allowedExtensions.includes(ext)) {
      return cb(null, true);
    }
  
    return cb(new Error('Only JPG, JPEG, and PNG files are allowed.'));
  };
  

const upload = multer({
    storage: Storage,
    fileFilter: imageFilter,
});

module.exports = upload;