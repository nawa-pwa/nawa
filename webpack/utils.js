const path = require('path'),
    glob = require('glob'),
    fs = require('fs');

    /**
     * @param fileDir{String}: it should be the abs path, like "/Users/villainhr/Desktop/files/code/nawa/test/cacheMatchRule"
     * @return Object: example shown below 
     */
    // {
    //     "cacheMatchRule": {
    //         "key": "cacheMatchRule",
    //         "index": "/Users/villainhr/Desktop/files/code/nawa/test/cacheMatchRule/index.js"
    //     },
    //     "idbTest": {
    //         "key": "idbTest",
    //         "index": "/Users/villainhr/Desktop/files/code/nawa/test/idbTest/index.js"
    //     },
    //     "kernel": {
    //         "key": "kernel",
    //         "index": "/Users/villainhr/Desktop/files/code/nawa/test/kernel/index.js",
    //         "sw": "/Users/villainhr/Desktop/files/code/nawa/test/kernel/sw.js"
    //     },
    // }
    
module.exports.produceHtmls = function (fileDir) {
    let fileExp = /\/\w+$/,
        dirs = [];

    fileDir = path.join(fileDir, '*');
    let files = glob.sync(fileDir)

    // only get dir path
    files = files.filter(file => {
        return fs.statSync(file).isDirectory();
    });

    let key, sw;
    for (let file of files) {
        key = fileExp.exec(file)[0].slice(1);
        let dirObj = {
            key,
            index: path.join(file, 'index.js')
        }

        // check sw
        sw = path.join(file, 'sw.js');
        fs.existsSync(sw) && (dirObj.sw = sw);

        dirObj.html = {
            title: key,
            filename: path.join(key,'index.html'),
            template: path.join('test',key,'index.html'),
            inject:true,
            chunks:[
                path.join(key,"index")
            ]
        }

        dirs.push(dirObj);
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

