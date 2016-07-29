var router = require('express').Router();
var path = require('path');
var Users = require('../models/user');

router.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, '../public/views/register.html'));
});

router.post('/', function(request, response) {
  Users.create(request.body.username, request.body.password, function(err) {
    if(err) {
      console.log('Error posting', err)
      response.sendStatus(500);
    } else {
      //the user is generated but is not logged in, so redirect to login page
      response.redirect('/');
    }
  });
});

module.exports = router;
