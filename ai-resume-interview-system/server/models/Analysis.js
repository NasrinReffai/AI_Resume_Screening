const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    jobRole: {
      type: String,
      required: true
    },
    score: Number,
    summary: String,
    strengths: [String],
    weaknesses: [String],
    missingSkills: [String],
    suggestions: [String],
    interviewQuestions: [String]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Analysis", analysisSchema);