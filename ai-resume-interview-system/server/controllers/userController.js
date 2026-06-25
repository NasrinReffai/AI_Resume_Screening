const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const axios = require('axios');
const pdf = require('pdf-parse');
const Groq = require("groq-sdk");
const Analysis = require("../models/Analysis");
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});


const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { username, education, skills } = req.body;

    let updateData = {
      username,
      education,
      skills
    };

    // Image upload pannirundha
    if (req.file) {

      const streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {

          const stream = cloudinary.uploader.upload_stream(
            { folder: "profile_images" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );

          streamifier.createReadStream(buffer).pipe(stream);
        });
      };

      const result = await streamUpload(req.file.buffer);

      updateData.profileImage = result.secure_url;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select('-password');

    res.json(user);

  } catch (err) {
    res.status(500).json({
      msg: "Server error",
      error: err.message
    });
  }
};

//ResumeURL
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "Resume file is required" });
    }

    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "resumes",
            resource_type: "raw",
            public_id: "Resume",
            overwrite: true
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        resumeUrl: result.secure_url,
        resumeName: "Resume.pdf"
      },
      { new: true }
    ).select("-password");

    res.json({
      msg: "Resume uploaded successfully",
      user
    });

  } catch (err) {
    res.status(500).json({
      msg: "Server error",
      error: err.message
    });
  }
};

//analzeResume
const analyzeResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.resumeUrl) {
      return res.status(400).json({ msg: "Please upload resume first" });
    }

    const response = await axios.get(user.resumeUrl, {
      responseType: "arraybuffer"
    });

    const pdfData = await pdf(response.data);
    const resumeText = pdfData.text;

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    const { jobRole } = req.body;
    const prompt = `
You are an expert ATS Resume Writer.

Transform the uploaded resume into a professional ATS-friendly resume for this target role:
${jobRole || "Software Developer"}

IMPORTANT RULES:
- Do not invent fake experience.
- Do not invent fake companies.
- Do not invent fake certifications.
- Do not invent fake projects.
- Keep all information truthful based on the original resume.
- Rewrite content professionally.
- Use strong action verbs.
- Organize skills category-wise.
- Prioritize keywords related to the selected role only if supported by the resume.
- Return ONLY valid JSON.
- No markdown.
- No explanation.

Return JSON exactly in this format:

{
  "personalInfo": {
    "name": "",
    "email": "",
    "phone": "",
    "linkedin": "",
    "github": "",
    "location": ""
  },
  "targetRole": "",
  "professionalSummary": "",
  "technicalSkills": {
    "programmingLanguages": [],
    "frontend": [],
    "backend": [],
    "database": [],
    "tools": []
  },
  "experience": [
    {
      "company": "",
      "position": "",
      "duration": "",
      "responsibilities": []
    }
  ],
  "projects": [
    {
      "title": "",
      "technologies": [],
      "description": []
    }
  ],
  "education": [
    {
      "degree": "",
      "institution": "",
      "year": ""
    }
  ],
  "certifications": [],
  "achievements": []
}

Original Resume:
${resumeText}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0
    });

    const aiText = completion.choices[0].message.content;

    const cleanJson = aiText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const analysis = JSON.parse(cleanJson);
    await Analysis.create({
      userId: req.user.id,
      jobRole: jobRole || "General IT Job",
      score: analysis.score,
      summary: analysis.summary,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      missingSkills: analysis.missingSkills,
      suggestions: analysis.suggestions,
      interviewQuestions: analysis.interviewQuestions
    });

    res.json({
      msg: "AI resume analysis successful",
      analysis
    });

  } catch (err) {
    console.log("FULL ERROR =>", err);

    res.status(500).json({
      msg: "AI resume analysis failed",
      error: err.message
    });
  }
};

//getAnalysisHistory
const getAnalysisHistory = async (req, res) => {
  try {
    const history = await Analysis.find({
      userId: req.user.id
    }).sort({ createdAt: -1 });

    res.json(history);
  } catch (err) {
    res.status(500).json({
      msg: "Failed to fetch history"
    });
  }
};

//generateATSResume
const generateATSResume = async (req, res) => {
  try {
    const { jobRole } = req.body;

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

    const prompt = `
You are an expert ATS Resume Writer.

Transform the uploaded resume into a professional ATS-friendly resume for this target role:
${jobRole || "Software Developer"}

STRICT ETHICAL RULES:
- Do NOT change the candidate's actual technology stack in experience.
- Do NOT convert PHP/CodeIgniter experience into Node.js/Express/MongoDB experience.
- Do NOT invent fake skills, fake companies, fake projects, fake certifications, or fake achievements.
- If a required skill for the target role is not in the original resume, do NOT add it as experience.
- You may only mention missing role skills in a separate "roleSuggestions" array.
- Keep all resume content truthful based on the original resume.

YOU MAY:
- Rewrite summary professionally.
- Improve grammar and formatting.
- Organize skills category-wise.
- Improve project descriptions using only technologies present in the original resume.
- Prioritize existing skills relevant to the selected role.
- Use strong action verbs.

Return ONLY valid JSON.
No markdown. No explanation.

Return JSON exactly in this format:

{
  "personalInfo": {
    "name": "",
    "email": "",
    "phone": "",
    "linkedin": "",
    "github": "",
    "location": ""
  },
  "targetRole": "",
  "professionalSummary": "",
  "technicalSkills": {
    "programmingLanguages": [],
    "frontend": [],
    "backend": [],
    "database": [],
    "tools": []
  },
  "experience": [
    {
      "company": "",
      "position": "",
      "duration": "",
      "responsibilities": []
    }
  ],
  "projects": [
    {
      "title": "",
      "technologies": [],
      "description": []
    }
  ],
  "education": [
    {
      "degree": "",
      "institution": "",
      "year": ""
    }
  ],
  "certifications": [],
  "achievements": [],
  "roleSuggestions": []
}

Original Resume:
${resumeText}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0
    });

    const aiText = completion.choices[0].message.content;

    const cleanJson = aiText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const atsResume = JSON.parse(cleanJson);

    res.json({
      msg: "ATS resume generated successfully",
      atsResume
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      msg: "ATS resume generation failed",
      error: err.message
    });
  }
};

module.exports = { getProfile, updateProfile, uploadResume, analyzeResume, getAnalysisHistory,generateATSResume};