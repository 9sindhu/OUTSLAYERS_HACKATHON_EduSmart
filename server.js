 import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

/* Simple readability score */
function calculateScore(text) {
  const words = text.split(/\s+/).length;

  if (words > 150) return 9;
  if (words > 100) return 7;
  if (words > 50) return 5;

  return 3;
}

app.post("/generate", async (req, res) => {

  try {

    const { text, mode, language } = req.body;

    if (!text || text.trim() === "") {
      return res.json({
        result: "Please enter educational content.",
        beforeScore: 0,
        afterScore: 0
      });
    }

    let prompt = "";

    /* Step 1 — Allow any input language */
    prompt += `The following text may be in any language. Understand it first.\n\n`;

    /* Step 2 — Apply accessibility mode */

    if (mode === "simplify") {
      prompt += `Explain this so a 10-year-old understands:\n${text}\n\n`;
    }

    else if (mode === "summary") {
      prompt += `Summarize this in 2-3 lines:\n${text}\n\n`;
    }

    else if (mode === "dyslexia") {
      prompt += `Rewrite using short simple sentences suitable for dyslexic readers:\n${text}\n\n`;
    }

    else if (mode === "example") {
      prompt += `Explain this concept using a very simple example:\n${text}\n\n`;
    }

    else {
      prompt += text;
    }

    /* Step 3 — Output language selection */

    if (language && language !== "English") {
      prompt += `Translate the final answer into ${language}.`;
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();

    console.log("GROQ RESPONSE:", JSON.stringify(data, null, 2));

    const output = data.choices?.[0]?.message?.content || "No output from model";

    const beforeScore = calculateScore(text);
    const afterScore = calculateScore(output);

    res.json({
      result: output,
      beforeScore,
      afterScore
    });

  }

  catch (err) {

    console.error("SERVER ERROR:", err);

    res.json({
      result: "Server Error: " + err.message,
      beforeScore: 0,
      afterScore: 0
    });

  }

});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});