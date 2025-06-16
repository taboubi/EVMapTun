console.log('--- [HOOK LOG] ---');
console.log('Current working directory:', process.cwd());
console.log('Node version:', process.version);
console.log('Env:', process.env.NODE_ENV);
console.log('Files in android/app/src/main/res/values:', require('fs').readdirSync('./android/app/src/main/res/values'));
console.log('Files in android/app/src/main:', require('fs').readdirSync('./android/app/src/main'));
console.log('Files in scripts:', require('fs').readdirSync('./scripts'));
console.log('--- [END HOOK LOG] ---');
