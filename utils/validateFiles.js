const path = require('path');
const { validationResult } = require('express-validator');
const fileExtensions = ['.jpg', '.jpeg', '.png', '.pdf' , '.docx']; // Add allowed file extensions

function validateFiles(req, res, next) {
    const errors = validationResult(req);

    if (!req.files) {
        return res.status(400).json({ errors: [{ msg: 'No files were uploaded.' }] });
    }

    const fileFields = Object.keys(req.files);

    for (const field of fileFields) {
        const file = req.files[field][0];
        const extname = path.extname(file.filename).toLowerCase();

        if (!fileExtensions.includes(extname)) {
            return res.status(400).json({ errors: [{ msg: 'Invalid file type. Allowed extensions are .jpg, .jpeg, .png, and .pdf.' }] });
        }

        if (file.size > 5 * 1024 * 1024) {
            return res.status(400).json({ errors: [{ msg: 'File size is too large. Maximum size allowed is 5MB.' }] });
        }
    }

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    next();
}

module.exports = validateFiles;
