const fs = require('fs');
const path = require('path');

let dir = "D:/Users/Baptiste/Documents/Dev/Repertory";

if(!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

module.exports