const Groq = require("groq-sdk");
const User = require("../models/User");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const extractJsonObject = (text) => {
  const clean = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const firstBrace = clean.indexOf("{");

  if (firstBrace === -1) {
    throw new Error("No JSON object found in AI response");
  }

  let count = 0;

  for (let i = firstBrace; i < clean.length; i++) {
    if (clean[i] === "{") count++;
    if (clean[i] === "}") count--;

    if (count === 0) {
      return clean.substring(firstBrace, i + 1);
    }
  }

  throw new Error("Invalid JSON object from AI");
};

const saveResumeData = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        resumeData: req.body
      },
      {
        returnDocument: "after"
      }
    ).select("-password");

    res.json({
      msg: "Resume details saved successfully",
      user
    });
  } catch (err) {
    res.status(500).json({
      msg: "Resume builder save failed",
      error: err.message
    });
  }
};

const generateAIResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.resumeData) {
      return res.status(400).json({
        msg: "Please fill Resume Builder first."
      });
    }
    console.log("Resume Data:");
console.log(JSON.stringify(user.resumeData, null, 2));

    const prompt = `
You are an expert ATS Resume Writer.

Create a professional ATS-friendly resume.

Rules:
- Use ONLY the information provided.
- Do NOT create fake experience.
- Do NOT create fake companies.
- Do NOT create fake projects.
- Improve grammar and formatting.
- Write a professional summary.
- Return ONLY raw JSON.
- Do not add explanation.
- Do not use markdown.

Format:
{
  "fullName":"",
  "email":"",
  "phone":"",
  "location":"",
  "linkedin":"",
  "github":"",
  "summary":"",
  "technicalSkills":[],
  "softSkills":[],
  "projects":[
    {
      "title":"",
      "description":[""],
      "technologies":[]
    }
  ],
  "experience":[
  {
    "role":"",
    "company":"",
    "duration":"",
    "points":[]
  }
],
  
  
  "education":{
    "degree":"",
    "college":"",
    "university":"",
    "duration":""
  },
  "certifications":[],
  "preferredRole":""
}

Experience Rules:
- If Resume Builder Data has internship, training, work, company, or role details, add it inside experience array.
- Do not skip internship.
- Do not invent fake company or fake dates.
- Description must be bullet points array.
- Parse experience text carefully.
- If experience text has "duration:", copy that value exactly into duration.
- Example: "duration:March 2026 – Present" means "duration":"March 2026 – Present".
- Do not skip duration.



Candidate Details:
Full Name: ${user.fullName}
Email: ${user.email}
Resume Builder Data:
${JSON.stringify(user.resumeData)}
`;
  
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2
    });

    const aiText = completion.choices[0].message.content;

    const jsonString = extractJsonObject(aiText);
    const generatedResume = JSON.parse(jsonString);

    user.generatedResume = generatedResume;
    await user.save();

    res.json({
      msg: "AI Resume Generated Successfully",
      resume: generatedResume
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      msg: "Resume generation failed",
      error: err.message
    });
  }
}
const suggestResumeField = async (req, res) => {
  try {
    const { role, field, currentText } = req.body;

    if (!role || !field) {
      return res.status(400).json({
        msg: "Role and field are required"
      });
    }

    const prompt = `
You are a professional ATS resume writer.

Preferred Role: ${role}
Resume Field: ${field}

Current User Text:
${currentText || "Empty"}

Task:
Generate or improve content for the selected resume field.

Rules:
- Return ONLY the final content.
- Do not add explanation.
- Do not use markdown heading.
- Keep it suitable for fresher or internship-level candidate.
- Do not invent fake company names.
- Do not invent fake certifications.

Field Formatting Rules:
- For careerObjective: return 2 to 3 professional sentences.
- For technicalSkills: return comma-separated skills only.
- For softSkills: return comma-separated soft skills only.
- For projects: return 3 to 5 bullet points about a relevant project.
- For experience: return 3 to 5 bullet points for internship/work responsibilities.
- For certifications: return comma-separated certification suggestions only.
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3
    });

    const suggestion = completion.choices[0].message.content.trim();

    res.json({
      msg: "Suggestion generated",
      suggestion
    });
  } catch (err) {
    res.status(500).json({
      msg: "Suggestion failed",
      error: err.message
    });
  }
};

module.exports = {
  saveResumeData,
  generateAIResume,
  suggestResumeField
};