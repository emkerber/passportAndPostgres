var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var path = require('path');

mongoose.connect('mongodb://localhost/passport_guide');

var Cat = mongoose.model('Cat', {name:String});

router.post('/add', function(request, response, next){
  var kitty = new Cat({name: request.body.name});
  kitty.save(function(err){
    if (err) {
      console.log('meow %s', err);
    }
    //response.send(kitty.toJSON()); "YUCK" -Joel
    response.send(kitty);
    next();
  });
});

router.get('/cats', function(request, response, next){
  Cat.find({}).exec(function(err, cats){
    if (err) {
      throw new Error(err);
    }
    response.send(cats);
    next();
  });
});

//most routes don't have a next, because usually you don't want it to keep looking for routes
router.get('/*', function(request, response, next) {
  console.log('A request was made at', new Date());
  next();
});


router.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, '../public/views/index.html'));
});

module.exports = router;
