const glob = require('glob'),
    path = require('path');

const filesPath = path.join(__dirname,'..','test',"*");

let file

glob(filesPath,{},(err,files)=>{
    // opt
    for(let file of files){

    }
    
})