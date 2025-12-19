const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateSummary(text) {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash"
    })
    const prompt = `
        Summarize the following document in:
        1. One short paragraph (max 4 lines)
        2. 5 concise bullet points

        Document:
        ${text}`
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response;
}
module.exports = {
    generateSummary
};