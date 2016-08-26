// user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
  id: String,
  username: String,
  password: String,
  token: String
});

User.plugin(passportLocalMongoose);


module.exports = mongoose.model('users', User);