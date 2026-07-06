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
    const { username, fullName, education, skills } = req.body;

    const updateData = {};

    if (username) updateData.fullName = username;
    if (fullName) updateData.fullName = fullName;
    if (education) updateData.education = education;

    if (skills) {
      updateData.skills = skills.split(",").map((s) => s.trim());
    }

    if (req.file) {
      const uploadFromBuffer = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "profile_images",
              resource_type: "image"
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const result = await uploadFromBuffer();
      updateData.profileImage = result.secure_url;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { returnDocument: "after" }
    ).select("-password");

    res.json({
      msg: "Profile updated successfully",
      user
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Profile update failed",
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
   
   let resumeText = "";

if (user.generatedResume) {
  resumeText = JSON.stringify(user.generatedResume, null, 2);
} else {
  const response = await axios.get(user.resumeUrl, {
    responseType: "arraybuffer"
  });

  const pdfData = await pdf(response.data);
  resumeText = pdfData.text;
}

if (!resumeText || resumeText.trim().length < 20) {
  return res.status(400).json({
    msg: "Resume text could not be extracted. Please upload a text-based PDF or generate resume using AI Resume Builder."
  });
}

   

    const { jobRole } = req.body;
   const prompt = `
You are an expert ATS Resume Analyzer.

Analyze the original resume for this selected role:
${jobRole || "Software Developer"}

Your task:
1. Give ATS score for the resume.
2. Explain how well the resume matches the selected role.
3. Identify strengths.
4. Identify weaknesses.
5. Identify missing skills for this role.
6. Give clear suggestions to improve the resume.
7. Give role-based interview questions.

Return ONLY valid JSON.
No markdown.
No explanation.

Return JSON exactly in this format:

{
  "score": 0,
  "summary": "",
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "suggestions": [],
  "interviewQuestions": []
}

Rules:
- score must be 0 to 100
- summary must explain ATS match for selected role
- suggestions must be practical resume improvement points
- missingSkills must be role-related
- Do not invent fake experience
- Be truthful based on original resume

Original Resume:
${resumeText}
`;
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
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
console.log("RESUME TEXT:", resumeText);
const prompt = `
You are an expert ATS Resume Writer.

Rewrite the original resume into a strong ATS-friendly resume for this selected role:
${jobRole || "Software Developer"}

Goal:
Create a better professional resume that can pass ATS screening and look suitable for the selected role.

STRICT RULES:
- Do NOT invent fake experience.
- Do NOT invent fake companies.
- Do NOT invent fake projects.
- Do NOT invent fake certifications.
- Do NOT invent fake achievements.
- Do NOT add skills that are not present in the original resume as real experience.
- If important role skills are missing, add them only in roleSuggestions.
- Keep the resume truthful.
- Improve wording professionally.
- Use strong action verbs.
- Make summary role-specific.
- Make project descriptions stronger and ATS-friendly.
- Organize skills category-wise.
- Keep content clean and professional.
If Original Resume text is empty, use Resume Builder Data.
Never return Not Provided if Resume Builder Data contains the value.

Return ONLY valid JSON.
No markdown.
No explanation.

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
User Details:
Name: ${user.fullName}
Email: ${user.email}

Resume Builder Data:
${JSON.stringify(user.resumeData, null, 2)}

Original Resume:
${resumeText || "No readable text found from uploaded PDF"}

`;
    const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
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

module.exports = { getProfile, updateProfile, uploadResume, analyzeResume, getAnalysisHistory, generateATSResume };