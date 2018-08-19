const glob = require('glob'),
    fs = require('fs'),
    path = require('path');

const filesPath = path.join(__dirname,'..','test',"*");

let fileExp = /\/\w+$/;
let dirs = {};

glob(filesPath,{},(err,files)=>{
    // opt
    let key,sw;
    for(let file of files){
        key = fileExp.exec(file)[0].slice(1);
        dirs[key] = {
            key,
            index: path.join(file,'index.js')
        }

        // check sw
        fs.existsSync(path.join(file,'sw.js'))
        && dirs[sw]
    }
    
})