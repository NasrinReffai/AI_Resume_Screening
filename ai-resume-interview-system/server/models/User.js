const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   fullName: {
      type: String,
      required: true
   },
   email: {
      type: String,
      unique: true,
      required: true
   },
   password: {
      type: String,
      required: true
   },
   profileImage: {
      type: String,
   },
   skills: [String],
   education: String,
   resumeUrl: {
      type: String,
      default: ""
   },
   resumeName: {
      type: String,
      default: ""
   }
});

module.exports = mongoose.model("User", userSchema);