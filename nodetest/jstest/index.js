const {
    globGrapHtmlDir,
    produceEntries,
    produceHtmlPlugins
} = require('./globTest'),
    routeText = require('./route'),
    {produceHtmls} = require('../../webpack/utils'),
    path = require('path');

class Test{
    constructor(){
        this.fileDir = path.join(__dirname,'..','test');
    }
    produceEntries(){
        let fileDir = path.join(__dirname,'..','test');
        let dirArr = produceHtmls(fileDir);
        produceEntries(dirArr);

        let htmlPlugins = produceHtmlPlugins(dirArr);

    }
    run(){
        globGrapHtmlDir(this.fileDir);
        this.produceEntries();
        routeText();
    }
    
}

new Test().run();