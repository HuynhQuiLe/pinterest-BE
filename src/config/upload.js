const multer = require("multer");

// process.cwd() //tra ve duong dan

let storage = multer.diskStorage({
  destination: process.cwd() + "/public/img", //dinh nghia duong dan luu hinh
  filename: (req, file, callback) => {
    let newName = new Date().getTime() + "_" + file.originalname;
    callback(null, newName);
  }, //doi ten hinh
});

let upload = multer({ storage });

module.exports = upload;
