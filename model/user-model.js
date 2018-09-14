const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username:String,
  connectionID:String,
  connection:String,
  token:String,
  tokenSecret: String
});

const User = mongoose.model('user', userSchema);

module.exports = User;
