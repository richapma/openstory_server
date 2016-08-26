// dependencies
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session'); //used but not with the memorystore.
var mongoose = require('mongoose'); 
var connect = require('connect');
var mongoStore = require('connect-mongo')(expressSession); //used to replace memory store in express-session.

//var hash = require('bcrypt-nodejs');
var path = require('path');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

// mongoose
mongoose.connect('mongodb://localhost/openstory');

// user schema/model
var User = require('./models/user.js');

// create instance of express
var app = express();

// require routes
var routes = require('./routes/api.js');
var openstory_routes = require('./routes/openstory_api.js');

// define middleware
app.use(express.static(path.join(__dirname, '../client')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(require('express-session')({
    secret: 'Ghp$^2S07^65@1#21lpA',
    resave: false,
    saveUninitialized: false,
    //change the store from the memorystore that express-session uses by default because memorystore is not production stable.
    store: new mongoStore({
      url:'mongodb://localhost/openstory'
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// configure passport
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// routes
app.use('/user/', routes);
app.use('/api/', openstory_routes);

app.get('/', function(req, res) {
  if(!req.isAuthenticated()){
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
  }
});

// error
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.end(JSON.stringify({
    message: err.message,
    error: {}
  }));
});

module.exports = app;
