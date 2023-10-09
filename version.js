// This code just read package.json file and prints
// the current version of the rika-auth.

const packageJson = require('./package.json');
console.log(packageJson.version);
