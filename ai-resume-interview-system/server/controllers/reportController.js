const User = require("../models/User");
const Analysis = require("../models/Analysis");
const Optimization = require("../models/Optimization");
const Interview = require("../models/Interview");

const getReport = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

    const latestAnalysis = await Analysis.findOne({ userId }).sort({
      createdAt: -1
    });

    const latestOptimization = await Optimization.findOne({ userId }).sort({
      createdAt: -1
    });

    const latestInterview = await Interview.findOne({ userId }).sort({
      createdAt: -1
    });

    const atsScore = latestAnalysis?.score || 0;
    const jdMatch = latestOptimization?.jdScore || 0;
    const interviewScore = latestInterview?.score || 0;

    const readiness = Math.round(
      atsScore * 0.4 + jdMatch * 0.3 + interviewScore * 10 * 0.3
    );

    res.json({
      fullName: user.fullName,
      email: user.email,
      resumeStatus: user.resumeUrl || user.generatedResume ? "Resume Ready" : "No Resume",
      resumeName: user.resumeName,
      resumeUrl: user.resumeUrl,

      atsScore,
      jdMatch,
      interviewScore,
      readiness,

      strongSkills: latestAnalysis?.strengths || [],
      improveSkills:
        latestOptimization?.missingSkills ||
        latestAnalysis?.missingSkills ||
        [],

      recommendations:
        latestOptimization?.recommendations ||
        latestAnalysis?.suggestions ||
        [],

      recommendedRoles: [
        user.generatedResume?.preferredRole ||
          latestOptimization?.jobRole ||
          "MERN Stack Developer"
      ]
    });
  } catch (err) {
    res.status(500).json({
      msg: "Report generation failed",
      error: err.message
    });
  }
};

module.exports = { getReport };