const multer = require("multer");

//upload the file using multer
const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error("file can only be jpg/png/jpeg"));
    }
    cb(undefined, true);
  },
});

module.exports = upload.single("avatar");
