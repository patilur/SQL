const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const genCategory = async (req, res) => {
    const { description } = req.body;

    try {
        const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const responseFromAI = await genAI.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Classify this expense description into exactly one category
            Rules:
            - Return ONLY one word
            - No explanation
            - No punctuation
            Description: "${description}"`
        })

        console.log("AI Response:", responseFromAI);
        res.status(200).json({ category: responseFromAI.text });

    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ response: "Something went wrong" });
    }
}


module.exports = { genCategory }