var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var User = require('./models/user');
var register = require('./routes/register');
var login = require('./routes/login');
var path = require('path');
var LocalStrategy = require('passport-local').Strategy;


app.use(session({
  secret: 'secret',
  key: 'user',
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 60 * 1000, secure: false}
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use('local', new LocalStrategy({
  usernameField : 'username', passwordField: 'password'
}, function(username, password, done) {
    User.findAndComparePassword(username, password, function(err, isMatch, user) {
      if (err) {
        return done(err);

      } else if(!user) {
        return done(null, false, { message : 'Incorrect username and password.' });

      } else if (isMatch) {
        return done(null, user);

      } else {
        done(null, false);
      };
    });
  })
);

//converts user to user id
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

//converts user id to user
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
app.use('/register', register);
app.use('/login', login);

app.get('/', function(request, response, next) {
  response.sendFile(path.resolve(__dirname, 'public/views/login.html'));
});

app.use('/api', function(request, response, next) {
  if (request.isAuthenticated()) {
    next();
  } else {
    response.sendStatus(403);
  }
});

var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
  console.log('Server listening on port', server.address().port);
});
