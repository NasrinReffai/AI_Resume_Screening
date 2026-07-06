const User = require("../models/User");
const axios = require("axios");
const pdf = require("pdf-parse");
const Groq = require("groq-sdk");
const Optimization = require("../models/Optimization");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// JD Match Analysis
const optimizeResume = async (req, res) => {
  try {
    const { jobDescription } = req.body;

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({
        msg: "Please paste job description first"
      });
    }

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
You are an ATS Resume-JD Matching Expert.

Compare the resume with the given job description.

STRICT JSON RULES:
- Return ONLY valid JSON.
- Do not add comments inside JSON.
- Every array value must be a simple string.
- Do not write text outside JSON.
- No markdown.

ANALYSIS RULES:
- Do not invent fake skills.
- matchedSkills must contain only skills clearly present in the resume.
- missingSkills must contain only important skills required by the job description but missing in the resume.
- Do not dump every technology from the JD into missingSkills.
- missingSkills should contain maximum 8 important gaps.
- matchScore must be from 0 to 100.

SKILL MATCHING RULES:
- React = React.js
- Node = Node.js
- Express = Express.js
- REST API = REST APIs = RESTful APIs
- JWT = JWT Authentication
- MongoDB = Mongo DB
- GitHub = Git Hub

ALTERNATIVE SKILL RULES:
- If JD says "React.js, Angular, or Vue.js", treat it as frontend framework experience.
- If resume has any one of React.js, Angular, or Vue.js, do not mark the others as missing.
- If JD says "Node.js, Python, or Java", treat it as backend programming experience.
- If resume has any one backend technology, do not mark all alternatives as missing.
- Do not mark optional alternatives as missing unless the JD specifically requires that exact skill.

NON-SKILL RULES:
- Do not treat salary, age, fresher, full-time, part-time, pay range, or location as missing skills.
- Do not treat "12th pass", "age 18+", or salary as skills.

CONSISTENCY RULES:
- If a skill appears in matchedSkills, it must not appear in missingSkills.
- If a skill appears in matchedSkills, do not mention lack of experience with that skill in weaknesses.

SCORE RULES:
- 80 to 100: Most required skills are present.
- 60 to 79: Many required skills are present, few important skills missing.
- 40 to 59: Some related skills are present, but major role skills missing.
- 1 to 39: Very few related skills are present.
- 0: No relevant skills match.

Return JSON exactly in this format:
{
  "matchScore": 0,
  "matchedSkills": [],
  "missingSkills": [],
  "strengths": [],
  "weaknesses": [],
  "suggestions": []
}

Resume:
${resumeText}

Job Description:
${jobDescription}
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

    let optimization;

    try {
      optimization = JSON.parse(cleanJson);
    } catch (parseErr) {
      console.log("INVALID AI JSON =>", cleanJson);

      return res.status(500).json({
        msg: "AI returned invalid JSON. Please try again.",
        error: parseErr.message
      });
    }
    await Optimization.create({
      userId: req.user.id,
      jobRole: "JD Match",
      jdScore: optimization.matchScore,
      matchedSkills: optimization.matchedSkills,
      missingSkills: optimization.missingSkills,
      strengths: optimization.strengths,
      weaknesses: optimization.weaknesses,
      recommendations: optimization.suggestions
    });
    res.json({
      msg: "Resume optimized successfully",
      optimization
    });

  } catch (err) {
    console.log("OPTIMIZATION ERROR =>", err);

    res.status(500).json({
      msg: "Optimization failed",
      error: err.message
    });
  }
};

// Generate Optimized Resume
const generateOptimizedResume = async (req, res) => {
  try {
    const { jobDescription } = req.body;

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({
        msg: "Please paste job description first"
      });
    }

    const user = await User.findById(req.user.id);

    if (!user.resumeUrl) {
      return res.status(400).json({
        msg: "Please upload resume first"
      });
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
    msg: "Resume text not found. Please upload a text-based resume or generate resume using AI Resume Builder."
  });
}
    const prompt = `
You are an ethical ATS resume optimization expert.

Optimize the resume for the given job description.

STRICT RULES:
- Do not invent fake experience.
- Do not invent fake companies.
- Do not invent fake projects.
- Do not invent fake certifications.
- Do not add skills as experience if they are not in the resume.
- You may improve wording, reorder skills, rewrite summary, and highlight relevant truthful experience.
- If a JD skill is missing, add it only in missingSkills, not in resume sections.
- Return ONLY valid JSON.
- No markdown.
VERY IMPORTANT:
- If name is not present in resume, return empty string.
- If company is not present in resume, return empty string.
- If experience is not present, return empty array.
- If education is not present, return empty array.
- Do NOT use sample names like John Doe.
- Do NOT use sample companies like ABC Corporation.
- Do NOT use sample universities like XYZ University.
- Do NOT create senior roles.
- Do NOT create fake years.
- Only rewrite existing information from the resume.
personalInfo should include:
{
  "name": "",
  "email": "",
  "phone": "",
  "location": "",
  "linkedin": "",
  "github": ""
}

If LinkedIn or GitHub is not present in resume, return empty string.
Do not invent LinkedIn or GitHub links.
PROFESSIONAL SUMMARY RULES:
- originalSummary should contain the resume's existing summary.
- optimizedSummary should contain the improved JD-specific summary.
- Rewrite optimizedSummary specifically for the given job description.
- Do not simply copy the original summary.
- Start with the target role from the job description.
- Mention only skills or technologies that are present in the original resume.
- If JD needs a skill that is missing in resume, do not mention it in optimizedSummary.
- Highlight transferable strengths like REST APIs, dashboards, authentication, real-time systems, database optimization, teamwork, debugging, deployment, and learning ability.
- Keep optimizedSummary between 60 and 90 words.
- Make it sound like this exact candidate applying for this exact job.

SKILL OPTIMIZATION RULES:
- Reorder skills based on relevance to the JD.
- Do not add missing JD skills into technicalSkills.
- Missing skills should contain maximum 8 important gaps only.
- Do not dump every JD technology into missingSkills.

ALTERNATIVE SKILL RULES:
- If JD says "React.js, Angular, or Vue.js", treat it as frontend framework experience.
- If resume has any one of React.js, Angular, or Vue.js, do not mark the others as missing.
- If JD says "Node.js, Python, or Java", treat it as backend programming experience.
- If resume has any one backend technology, do not mark all alternatives as missing.

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
  "optimizedSummary": "",
  "technicalSkills": {
    "programmingLanguages": [],
    "frontend": [],
    "backend": [],
    "database": [],
    "tools": []
  },
  "experience/Internship": [
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
  "missingSkills": [],
  "optimizationNotes": []
}

Resume:
${resumeText}

Job Description:
${jobDescription}
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

    let optimizedResume;

    try {
      optimizedResume = JSON.parse(cleanJson);
    } catch (parseErr) {
      console.log("INVALID OPTIMIZED RESUME JSON =>", cleanJson);

      return res.status(500).json({
        msg: "AI returned invalid JSON. Please try again.",
        error: parseErr.message
      });
    }

    res.json({
      msg: "Optimized resume generated successfully",
      optimizedResume
    });

  } catch (err) {
    console.log("GENERATE OPTIMIZED RESUME ERROR =>", err);

    res.status(500).json({
      msg: "Optimized resume generation failed",
      error: err.message
    });
  }
};

module.exports = {
  optimizeResume,
  generateOptimizedResume
};