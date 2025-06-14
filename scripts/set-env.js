const fs = require('fs');
const path = require('path');

const envContent = process.env.ENV_FILE_CONTENT;

if (!envContent) {
  console.error("❌ ENV_FILE_CONTENT n'est pas défini !");
  process.exit(1);
}

const filePath = path.join(__dirname, '../src/environments/environment.ts');
const filePathprod = path.join(__dirname, '../src/environments/environment.prod.ts');

// Astuce : remplace les caractères d'échappement si nécessaire
const decodedContent = envContent.replace(/\\n/g, '\n');

fs.writeFileSync(filePath, decodedContent);
fs.writeFileSync(filePathprod, decodedContent);
console.log("✅ Fichier environment.ts mis à jour à partir de ENV_FILE_CONTENT");