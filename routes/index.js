var express = require('express');
var router = express.Router();

var fs = require('fs');
var uniqid = require('uniqid');

var cloudinary = require('cloudinary').v2;

cloudinary.config({
 cloud_name: 'dqulnrq1a',
 api_key: '364443491521971',
 api_secret: 'A0F9bGbCdj32jtxcQ-lVWChyIxk' 
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/upload', async function(req, res, next) {
  var imageFile = './tmp/'+uniqid()+'.jpg'
  var resultCopy = await req.files.photo.mv(imageFile);

 if(!resultCopy) {
  var resultCloudinary = await cloudinary.uploader.upload(imageFile);
  fs.unlinkSync(imageFile);
  if (resultCloudinary) {
    res.json(resultCloudinary);
  } else {
    res.json({result: false, message: 'erreur cloudinary'});
  }
   // res.json({result: true, message: 'File uploaded!'});      
  } else {
   res.json({result: false, message: resultCopy} );
  }
 
});

module.exports = router;
