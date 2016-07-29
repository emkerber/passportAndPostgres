var express = require('express');
var router = express.Router();
var path = require('path');



//most routes don't have a next, because usually you don't want it to keep looking for routes
router.get('/*', function(request, response, next) {
  console.log('A request was made at', new Date());
  next();
});


router.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, '../public/views/index.html'));
});

module.exports = router;
