const glob = require('glob'),
    path = require('path');

const filesPath = path.join(process.env.PWD,'..','test');


glob('../test',{},(err,files)=>{
    // opt
})