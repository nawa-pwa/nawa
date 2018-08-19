const glob = require('glob'),
    fs = require('readdirSync'),
    path = require('path');

const filesPath = path.join(__dirname,'..','test');

let testNode = fs.readdirSync(filesPath);
