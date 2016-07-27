var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var session = require('express-session');
var index = require('./routes/index.js');
var User = require('./models/user');
var register = require('./routes/register');
var login = require('./routes/login');

//Mongo setup
var mongoURI = 'mongodb://localhost:27017/passport_guide';
var MongoDB = mongoose.connect(mongoURI).connection;

MongoDB.on('error', function(err) {
  console.log('MongoDB connection error', err);
});

MongoDB.once('open', function() {
  console.log('MongoDB connection open');
});

app.use(session({
  secret: 'secret',
  key: 'user',
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 60000, secure: false}
}));

var localStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(passport.session());

passport.use('local', new localStrategy({ passReqToCallback : true, usernameField : 'username' },
  function(request, username, password, done) {
    User.findOne({ username : username }, function(err, user) {
      if(err) {
        throw err;
      };

      if(!user) {
        return done(null, false, { message : 'Incorrect username and password.' });
      }

      //to test a matching password
      user.comparePassword(password, function(err, isMatch) {
        if(err) {
          throw err;
        }

        if(isMatch) {
          return done(null, user);
        } else {
          done(null, false, { message : 'Incorrect username and password.'});
        }
      });
    });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    if(err) {
      return done(err);
    }
    done(null, user);
  });
});

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.use('/', index);
app.use('/register', register);
app.use('/login', login);

app.get('/', function(request, response, next) {
  response.sendFile(path.resolve(__dirname, 'public/views/login.html'));
});

var server = app.listen(3000, function() {
  var port = server.address().port;
  console.log('Listening on port:', port);
});
