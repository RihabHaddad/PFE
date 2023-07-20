const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  cin: {
    type: String,
    required: true
  },
  drivingLicense: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('users', userSchema);