const glob = require('glob'),
    path = require('path');

const filesPath = path.join(__dirname,'..','test',"*");

let fileExp = /\/\w+$/;
let dirs = {};

glob(filesPath,{},(err,files)=>{
    // opt
    for(let file of files){
        
    }
    
})