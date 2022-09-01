const multer = require("multer");

//for uploading profile image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname + "");
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
//console.log(upload);
exports.upload = multer({
  storage: storage,
  limits: {
    fileSize: 52428800,
    fieldSize: 52428800,
  },

  fileFilter: fileFilter,
});
