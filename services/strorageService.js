const multer = require('multer');
const path = require('path');
const csvStorage = multer.diskStorage({
  destination: 'uploads',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now()
      + path.extname(file.originalname))

  }
});
const csvUpload = multer({
  storage: csvStorage,
  fileFilter(req, file, cb) {
    if (file.mimetype == 'text/csv' && (file.originalname.split('.')[1] == 'CSV' || file.originalname.split('.')[1] == 'csv')) {

      cb(undefined, true)
    }
    else {
      return cb('Please upload a CSV', false)
    }

  }
})

module.exports = csvUpload