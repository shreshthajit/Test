
const multer = require("multer");
const path = require("path");

var storage = multer.diskStorage({
    destination: "public/uploads",
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

exports.uploadImage = multer({
    storage: storage,
});
