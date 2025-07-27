const fs = require('fs');
const path = require('path');

const pkg = require('../package.json');

const versionName = pkg.version;
const versionCode = parseInt(pkg.version.replace(/\D/g, '')) || 1;

const gradlePath = path.join(__dirname, '../android/app/build.gradle');

let gradle = fs.readFileSync(gradlePath, 'utf8');

gradle = gradle.replace(/versionCode\s+\d+/, `versionCode ${versionCode}`);
gradle = gradle.replace(/versionName\s+"[^"]+"/, `versionName "${versionName}"`);

fs.writeFileSync(gradlePath, gradle);

console.log(`✔️ Version Android mise à jour : ${versionName} (${versionCode})`);
