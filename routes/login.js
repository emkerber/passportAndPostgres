var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');

// old code, from earlier in assignment:
// router.get('/', function(request, response, next) {
//   response.json(path.resolve(__dirname, '../public/views/login.html'));
// });

router.get('/', function(request, response, next) {
  // response.json(request.isAuthenticated());
  response.sendFile(path.resolve(__dirname, '../public/views/login.html'));
});

router.post('/',
  passport.authenticate('local', {
    successRedirect: '/views/success.html',
    failureRedirect: '/views/failure.html'
  })
);

module.exports = router;
