const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    role: {
      type: String,
      default: ""
    },

    question: String,
    userAnswer: String,
    correctAnswer: String,

    score: {
      type: Number,
      default: 0
    },

    feedback: String,
    improvements: [String]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Interview", interviewSchema);