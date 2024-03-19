const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './backend/public/images');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname); // Fájl kiterjesztésének meghatározása
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension); // Fájl név összeállítása kiterjesztéssel
  }
});



const upload = multer({ storage: storage });

module.exports = upload
