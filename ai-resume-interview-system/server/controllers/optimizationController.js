const User = require("../models/User");
const axios = require("axios");
const pdf = require("pdf-parse");
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const optimizeResume = async (req, res) => {
  try {

    const { jobDescription } = req.body;

    const user = await User.findById(req.user.id);

    if (!user.resumeUrl) {
      return res.status(400).json({
        msg: "Please upload resume first"
      });
    }

    const response = await axios.get(user.resumeUrl, {
      responseType: "arraybuffer"
    });

    const pdfData = await pdf(response.data);

    const resumeText = pdfData.text;

    // Prompt comes here...

    res.json({
      msg: "Resume Loaded Successfully",
      resumeText,
      jobDescription
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      msg: "Optimization failed"
    });

  }
};

module.exports = {
  optimizeResume
};