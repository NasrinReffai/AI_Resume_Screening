const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  optimizeResume
} = require("../controllers/optimizationController");

router.post(
  "/optimize",
  authMiddleware,
  optimizeResume
);

module.exports = router;