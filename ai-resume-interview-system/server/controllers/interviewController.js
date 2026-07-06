const Interview = require("../models/Interview");
const User = require("../models/User");
const axios = require("axios");
const pdf = require("pdf-parse");
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const cleanAIJson = (text) => {
  let clean = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const firstBrace = clean.indexOf("{");
  const lastBrace = clean.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1) {
    clean = clean.substring(firstBrace, lastBrace + 1);
  }

  return clean;
};
const generateInterview = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.resumeUrl) {
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
You are a professional technical interviewer.

Analyze the candidate resume and generate 30 interview questions.
Return ONLY raw JSON.
Do not write explanation.
Do not write "Here's".
Do not use markdown.

Generate 30 interview questions based on this resume.


Rules:
- Questions must be based only on the resume.
- Include questions from skills, projects, experience, education, and tools.
- Mix Easy, Medium, and Hard difficulty.
- Do not ask unrelated questions.
- Expected answer should be clear and interview-ready.
- Return ONLY valid JSON. No markdown.

Format:
{
  "questions": [
    {
      "question": "",
      "expectedAnswer": "",
      "difficulty": "Easy"
    }
  ]
}

Resume:
${resumeText}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3
    });

    const aiText = completion.choices[0].message.content;
    const interview = JSON.parse(cleanAIJson(aiText));

    res.json({
      msg: "Interview questions generated successfully",
      interview
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Interview generation failed",
      error: err.message
    });
  }
};

const evaluateAnswer = async (req, res) => {
  try {
    const { question, expectedAnswer, userAnswer } = req.body;

    if (!userAnswer || userAnswer.trim() === "") {
      return res.status(400).json({
        msg: "Please enter your answer"
      });
    }

    const prompt = `
You are a strict but helpful interview evaluator.

Compare the user's answer with the expected answer.

Return ONLY valid JSON. No markdown.

Format:
{
  "score": 0,
  "correctAnswer": "",
  "feedback": "",
  "correctPoints": [],
  "missingPoints": [],
  "improvements": []
}

Rules:
- Score must be from 0 to 10.
- If user answer is very close to expected answer, give high score.
- Do not give low score unnecessarily.
- correctAnswer should be a polished interview answer.
- Feedback should explain clearly.

Question:
${question}

Expected Answer:
${expectedAnswer}

User Answer:
${userAnswer}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0
    });

    const aiText = completion.choices[0].message.content;
    console.log("AI RESPONSE:", aiText);
    const evaluation = JSON.parse(cleanAIJson(aiText));
    await Interview.create({
      userId: req.user.id,
      role: req.body.role || "",
      question,
      userAnswer,
      correctAnswer: evaluation.correctAnswer,
      score: evaluation.score,
      feedback: evaluation.feedback,
      improvements: evaluation.improvements
    });

    res.json({
      msg: "Answer evaluated successfully",
      evaluation
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Answer evaluation failed",
      error: err.message
    });
  }
};

module.exports = {
  generateInterview,
  evaluateAnswer
};