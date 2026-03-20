const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Serve the frontend
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Gemini AI Integration Route
app.post("/ask", async (req, res) => {
    const { prompt } = req.body;

    try {
        const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const responseFromAI = await genAI.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
        })

        console.log("AI Response:", responseFromAI);
        res.status(200).json({ response: responseFromAI.text });

    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ response: "Something went wrong" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log("Loaded Key:", process.env.GEMINI_API_KEY ? "Exists" : "Missing");
});