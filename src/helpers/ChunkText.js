//this file is a helper method used to send pdf data into chunks
function chunkText(text, chunkSize = 800) {
    const chunks = [];

    for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push(text.slice(i, i + chunkSize));
    }

    return chunks;
}