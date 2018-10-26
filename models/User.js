const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  googleTD: {
    type: String,
    required: true
  },
  displayName: {
    type: String
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  gender: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('users', UserSchema);