let genai = require('@google/genai')
require("dotenv").config();

let ai = new genai.GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function main() {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Explain what AI is in 2 sentences",
    })
    console.log(response.text);
}

main();