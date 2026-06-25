const User = require("../models/User");
const axios = require("axios");
const pdf = require("pdf-parse");
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const generateInterview = async (req, res) => {
  try {
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
You are an AI Interview Trainer.

Generate 10 interview questions based on this resume.
Return ONLY valid JSON.

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

    const interview = JSON.parse(cleanJson);

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

    if (!userAnswer) {
      return res.status(400).json({
        msg: "Please enter your answer"
      });
    }

    const prompt = `
You are an interview evaluator.

Evaluate the user's answer.

Return ONLY valid JSON.

Format:
{
  "score": 0,
  "feedback": "",
  "improvements": []
}

Question: ${question}

Expected Answer: ${expectedAnswer}

User Answer: ${userAnswer}
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

    const evaluation = JSON.parse(cleanJson);

    res.json({
      msg: "Answer evaluated successfully",
      evaluation
    });
  } catch (err) {
    res.status(500).json({
      msg: "Answer evaluation failed",
      error: err.message
    });
  }
};

module.exports = { generateInterview ,evaluateAnswer};