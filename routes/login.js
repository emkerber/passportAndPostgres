var router = require('express').Router();
var passport = require('passport');

router.get('/', function(request, response) {
  // response.sendFile(path.join(__dirname, '../public/views/login.html'));
  response.send(request.isAuthenticated());
});

router.post('/', passport.authenticate('local', {
    successRedirect: '/views/success.html',
    failureRedirect: '/views/failure.html'
  })
);

module.exports = router;
