const User = require("../models/User");

const getResumeCenter = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json({
    hasResume: !!user.resumeUrl,
    resumeName: user.resumeName,
    resumeUrl: user.resumeUrl,
    fullName: user.fullName,
    email: user.email,
    profileImage: user.profileImage,

    resumeSource:
        user.resumeName === "AI_Generated_Resume.pdf"
            ? "AI Resume Builder"
            : "Uploaded Resume"
});
  } catch (err) {
    res.status(500).json({
      msg: "Failed to load Resume Center",
      error: err.message
    });
  }
};

module.exports = {
  getResumeCenter
};