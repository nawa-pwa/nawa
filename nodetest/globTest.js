const glob = require('glob'),
    fs = require('fs'),
    path = require('path');




module.exports.globGrapHtmlDir = (fileDir) => {
    let fileExp = /\/\w+$/,
        dirs = {};

    fileDir = path.join(fileDir, '*');
    let files = glob.sync(fileDir)

    // only get dir path
    files = files.filter(file => {
        return fs.statSync(file).isDirectory();
    });

    let key, sw;
    for (let file of files) {
        key = fileExp.exec(file)[0].slice(1);
        dirs[key] = {
            key,
            index: path.join(file, 'index.js')
        }

        // check sw
        sw = path.join(file, 'sw.js');
        fs.existsSync(sw) && (dirs[key].sw = sw);
    }

    return dirs;
}

module.exports.produceEntries = function(dirArr){
    let entries = {};

    for(let entry of dirArr){
        let indexKey = path.join(entry.key,"index"); 
        entries[indexKey] = entry.index; // set the entry's key,like "middleware/index": xxxx

        if(entry.sw){
            let swKey = path.join(entry.key,'sw');
            entries[swKey] = entry.sw; // set the entry's sw key, like "middleware/sw": xxx
        }
    }

    return entries;
}

module.exports.produceHtmlPlugins = function(dirArr){
    return dirArr.map(dir=>{
        return dir.html;
    })
}

