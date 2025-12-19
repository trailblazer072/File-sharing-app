const pdf = require("pdf-parse");

async function extractTextFromPDF(buffer) {
    // pdf-parse v1.1.1 handles Buffer directly
    const data = await pdf(buffer);
    return data.text.slice(0, 10000); //limiting the tokens
}

module.exports = {
    extractTextFromPDF
};
