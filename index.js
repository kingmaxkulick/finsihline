// Convert this file to CommonJS format
// This avoids ES Module errors
const electron = require('./electron.js');

// If you need to export anything, use module.exports instead of export
module.exports = electron;