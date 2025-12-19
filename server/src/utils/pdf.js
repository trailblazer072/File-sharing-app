const { PDFParse } = require("pdf-parse");

async function extractTextFromPDF(buffer) {
    const uint8Array = new Uint8Array(buffer);
    const parser = new PDFParse(uint8Array);
    let text = await parser.getText();
    if (typeof text !== 'string') {
        text = text.text || JSON.stringify(text);
    }
    return (text || "").slice(0, 1000); //limiting the tokens
}

module.exports = {
    extractTextFromPDF
};
