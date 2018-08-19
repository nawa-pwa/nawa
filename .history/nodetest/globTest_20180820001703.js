const glob = require('glob'),
    fs = require('fs'),
    path = require('path');

const testDir = 'test';
const filesPath = path.join(__dirname,'..',testDir,"*");

let fileExp = /\/\w+$/;
let dirs = {};

glob(filesPath,{stat:'DIR'},(err,files)=>{
    // opt

    files = files.filter(file=>{
        fs.
    })

    let key,sw;
    for(let file of files){
        key = fileExp.exec(file)[0].slice(1);
        dirs[key] = {
            key,
            index: path.join(file,'index.js')
        }

        // check sw
        sw = path.join(file,'sw.js');
        fs.existsSync(sw) && (dirs.sw = sw);
    }


})

