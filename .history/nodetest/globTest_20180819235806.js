const glob = require('glob'),
    path = require('path');

const filesPath = path.join(__dirname,'..','test',"*");

let fileExp = /\/\w+$/;
let dirs = {};

glob(filesPath,{},(err,files)=>{
    // opt
    let key;
    for(let file of files){
        key = fileExp.exec(file)[0].slice(1);
        dirs
    }
    
})