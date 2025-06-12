const express = require("express");
const cors = require("cors");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const userMsg = req.body.message;
  const reply = `You said: ${userMsg}`;
  res.json({ reply });
});

app.post("/image", upload.single("image"), async (req, res) => {
  const reply = "Nice image! I'll tell you more when image analysis is added.";
  res.json({ reply });
});

app.listen(PORT, () => console.log("Server running on port", PORT));