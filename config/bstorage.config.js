
var config = require('../config/config.json')[process.env.NODE_ENV]
var multer = require('multer')
var upload

if(process.env.NODE_ENV == 'development'){

    // const upload = multer({ dest: '../uploads/'})
    var storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './uploads');
        },
        filename: function (req, file, cb) {
            cb(null , file.originalname);
        }
    })
    var upload = multer({storage:storage})
}


module.exports = upload;