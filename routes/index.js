var express = require('express');
var router = express.Router();

var fs = require('fs');
var uniqid = require('uniqid');

var cloudinary = require('cloudinary').v2;

var request = require('sync-request');

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
  
  var options = {
    json: {
      apiKey: "5c0a5d392c1745d2ae84dc0b1483bfd2",
      image: resultCloudinary.url,
    },
   };
   //console.log(resultCloudinary.url);
   var resultDetectionRaw = await request('POST', 'https://lacapsule-faceapi.herokuapp.com/api/detect', options);
   
   var resultDetection = await resultDetectionRaw.body;
   resultDetection = await JSON.parse(resultDetection);
//console.log(resultDetection);

  if (resultCloudinary) {
    res.json({result : resultDetection, url : resultCloudinary.url});
  } else {
    res.json({result: false, message: 'erreur cloudinary'});
  }
   // res.json({result: true, message: 'File uploaded!'});      
  } else {
   res.json({result: false, message: resultCopy} );
  }
 
});

module.exports = router;
