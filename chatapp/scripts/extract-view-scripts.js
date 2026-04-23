const fs = require('fs');
const path = require('path');

const viewsDir = path.join(__dirname, '..', 'views');
const outputDir = path.join(__dirname, '..', 'report', '.tmp-view-scripts');

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

const viewFiles = fs
  .readdirSync(viewsDir)
  .filter((file) => file.endsWith('.ejs'));

const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let extractedCount = 0;

for (const viewFile of viewFiles) {
  const fullPath = path.join(viewsDir, viewFile);
  const source = fs.readFileSync(fullPath, 'utf8');

  let match;
  let scriptIndex = 0;
  while ((match = scriptRegex.exec(source)) !== null) {
    const scriptBody = (match[1] || '').trim();
    if (!scriptBody) {
      continue;
    }
    const sanitizedScriptBody = scriptBody
      .replace(/<%[\s\S]*?%>/g, '"__EJS_TEMPLATE__"')
      // Plato's parser (Babylon) in this setup does not support optional chaining.
      .replace(/\?\./g, '.');

    const safeBaseName = path.basename(viewFile, '.ejs');
    const outFile = path.join(outputDir, `${safeBaseName}.inline-${scriptIndex}.js`);

    fs.writeFileSync(
      outFile,
      `/* extracted from views/${viewFile} */\n${sanitizedScriptBody}\n`,
      'utf8'
    );
    scriptIndex += 1;
    extractedCount += 1;
  }
}

console.log(`Extracted ${extractedCount} inline script block(s) from views.`);
