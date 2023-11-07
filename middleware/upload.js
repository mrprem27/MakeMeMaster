const multer = require('multer');
let path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'text/xml', 'text/csv', 'text/plain', 'application/xml', 'application/zip', 'application/pdf'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        console.log("unSupported File Type");
        cb(null, false);
    }
}

var upload = multer({ storage: storage, limits: 1024 * 1024 * 8 });
//max 10mb file can be uploded
module.exports = upload