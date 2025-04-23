const multer=require("multer")
// const crypto=require("crypto")
// const path = require("path")

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

module.exports=upload