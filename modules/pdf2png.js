const { promises: fs } = require("node:fs");
const { pdf } = require("pdf-to-img");

async function pdf2png(submitId) {
    const document = await pdf(`./tmp/${submitId}.pdf` , {scale : 3}).catch(() => { console.error("can't read PDF") });
    await fs.writeFile(`./tmp/${submitId}.png`, document);
}

module.exports = { pdf2png }

