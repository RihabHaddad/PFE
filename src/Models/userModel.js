const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
 
  Firstname: {
    type: String,
    required: true
  },
  Lastname: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true,
    unique: true
  },
  PhoneNumber: {
    type: String,
    required: true
  },
  CIN: {
    type: String,
    required: true
  },
  Drivinglisence: {
    type: String,
    required: true,
    unique: true
  },
  
});

UserSchema.path('Email').validate((val) => {
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(val);
}, 'Invalid e-mail.');

const User = mongoose.model('users', UserSchema);
module.exports = User;
