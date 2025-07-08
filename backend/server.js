const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { getGeminiResponse } = require("./googleai");

const PORT = process.env.PORT || 5000;
const app = express();

// Use CORS with specific origin for frontend
app.use(
  cors({
    origin: "http://127.0.0.1:5500", // or '*' for all origins (not for production)
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const userMsg = req.body.message;
  if (!userMsg) return res.status(400).json({ reply: "No message provided." });
  const botReply = await getGeminiResponse(userMsg);
  res.json({ reply: botReply });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
