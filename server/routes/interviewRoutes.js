const express = require("express");
const OpenAI = require("openai");

const router = express.Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/questions", async (req, res) => {
  try {
    const { jobTitle } = req.body;

    if (!jobTitle || !jobTitle.trim()) {
      return res.status(400).json({ message: "Job title is required" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ message: "Missing OPENAI_API_KEY in server .env" });
    }

    const response = await client.responses.create({
      model: "gpt-5.2",
      input: `
Generate exactly 5 interview questions for this role: ${jobTitle}.

Rules:
- Mix behavioral and role-specific questions.
- Keep each question concise.
- Return only the 5 questions.
- Number them 1 to 5.
      `,
    });

    const questions = response.output_text
      .split("\n")
      .map((line) => line.replace(/^\d+[\).\s-]*/, "").trim())
      .filter(Boolean)
      .slice(0, 5);

    res.json({ questions });
  } catch (error) {
    console.error("Interview question error:", error);

    res.status(500).json({
      message: error.message || "Failed to generate interview questions",
    });
  }
});

module.exports = router;