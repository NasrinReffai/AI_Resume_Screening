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
   },
   resumeData: {
  phone: String,
  location: String,
  linkedin: String,
  github: String,
  careerObjective: String,
  technicalSkills: String,
  softSkills: String,
  projects: String,
  experience: String,
  certifications: String,
  preferredRole: String
},
resumeData: {
  type: Object,
  default: null
},
generatedResume: {
  type: Object,
  default: null
}
});

module.exports = mongoose.model("User", userSchema);