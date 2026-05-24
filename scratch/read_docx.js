const mammoth = require("mammoth");
const fs = require("fs");
const path = require("path");

async function readDocx(filename) {
    const filePath = path.join(__dirname, "../Internship_Template_Doc", filename);
    if (!fs.existsSync(filePath)) {
        console.log("File not found:", filePath);
        return;
    }
    const result = await mammoth.extractRawText({path: filePath});
    console.log(`\n\n--- CONTENT OF ${filename} ---\n`);
    console.log(result.value);
}

async function main() {
    await readDocx("ProjXpertLabs_Internship_Joining_Letter.docx");
    await readDocx("ProjXpertLabs_Invoice_Template.docx");
}

main().catch(console.error);
