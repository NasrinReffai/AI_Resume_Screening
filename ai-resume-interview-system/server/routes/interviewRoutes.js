const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  generateInterview,
  evaluateAnswer
} = require("../controllers/interviewController");

router.post("/generate", authMiddleware, generateInterview);
router.post("/evaluate", authMiddleware, evaluateAnswer);

module.exports = router;