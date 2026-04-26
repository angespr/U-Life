// const express = require("express");
// const OpenAI = require("openai");

// const router = express.Router();

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// router.post("/questions", async (req, res) => {
//   try {
//     const { jobTitle } = req.body;

//     if (!jobTitle || !jobTitle.trim()) {
//       return res.status(400).json({ message: "Job title is required" });
//     }

//     if (!process.env.OPENAI_API_KEY) {
//       return res.status(500).json({ message: "Missing OPENAI_API_KEY in server .env" });
//     }

//     const response = await client.responses.create({
//       model: "gpt-5.2",
//       input: `
// Generate exactly 5 interview questions for this role: ${jobTitle}.

// Rules:
// - Mix behavioral and role-specific questions.
// - Keep each question concise.
// - Return only the 5 questions.
// - Number them 1 to 5.
//       `,
//     });

//     const questions = response.output_text
//       .split("\n")
//       .map((line) => line.replace(/^\d+[\).\s-]*/, "").trim())
//       .filter(Boolean)
//       .slice(0, 5);

//     res.json({ questions });
//   } catch (error) {
//     console.error("Interview question error:", error);

//     res.status(500).json({
//       message: error.message || "Failed to generate interview questions",
//     });
//   }
// });

// module.exports = router;

const express = require("express");
const OpenAI = require("openai");

const router = express.Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* =========================
   Interview Questions Route
========================= */
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

/* =========================
   Networking Events Route
========================= */
router.post("/events", async (req, res) => {
  try {
    const { eventPrompt } = req.body;

    if (!eventPrompt || !eventPrompt.trim()) {
      return res.status(400).json({ message: "Event search prompt is required" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ message: "Missing OPENAI_API_KEY in server .env" });
    }

    const response = await client.responses.create({
      model: "gpt-5.2",
      tools: [{ type: "web_search_preview" }],
      input: `
Search the web for upcoming networking events based on this user request:

"${eventPrompt}"

Return ONLY valid JSON. Do not include markdown.

Return this shape:
{
  "events": [
    {
      "name": "",
      "occasion": "",
      "date": "",
      "time": "",
      "location": "",
      "city": "",
      "description": "",
      "link": "",
      "mapQuery": ""
    }
  ]
}

Rules:
- Return up to 5 relevant upcoming events.
- Prefer events with a clear date, time, location, and official link.
- If time is unknown, write "Time not listed".
- If location is online, write "Online".
- mapQuery should be a Google Maps search-friendly string using event name + location.
- If no good events are found, return { "events": [] }.
      `,
    });

    let parsed;

    try {
      parsed = JSON.parse(response.output_text);
    } catch {
      console.error("Raw events response:", response.output_text);
      return res.status(500).json({
        message: "OpenAI returned events in an invalid format",
      });
    }

    res.json({
      events: Array.isArray(parsed.events) ? parsed.events : [],
    });
  } catch (error) {
    console.error("Networking events error:", error);
    res.status(500).json({
      message: error.message || "Failed to search networking events",
    });
  }
});

module.exports = router;