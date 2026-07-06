const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { saveResumeData, generateAIResume ,suggestResumeField} = require("../controllers/resumeBuilderController");


router.post("/save", authMiddleware, saveResumeData);
router.post("/generate", authMiddleware, generateAIResume);
router.post("/suggest", authMiddleware, suggestResumeField);

module.exports = router;