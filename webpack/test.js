const glob = require("glob");
const path = require("path");

let arr = glob.sync(path.join(__dirname,"./test/**/*.js"));

let matchKey = /test\/(.*)\.js/;

let entry = {};

for(var file of arr){
    entry[matchKey.exec(file)[1]] = file;
}



let htmlArr = glob.sync(path.join(__dirname,"./test/**/*.html"));

let plugins = [];
let htmlTitle = /test\/(.*)\.html/
let fileNameHTML = /test\/.*\.html/

for(var html of htmlArr){
    let res = htmlTitle.exec(html);
    let filename = res[0];
    let title = res[1];
    let chunks = [title];
    plugins.push({
        filename,title,chunks
    })
}

console.log(plugins);