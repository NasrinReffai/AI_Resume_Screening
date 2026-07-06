const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");


// const {optimizeResume} = require("../controllers/optimizationController");

const {optimizeResume,generateOptimizedResume} = require("../controllers/optimizationController");

router.post("/optimize",authMiddleware,optimizeResume);

router.post("/generate-resume",authMiddleware,generateOptimizedResume);

module.exports = router;