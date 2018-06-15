import Nawa from '../../src';
import LFU from '../../src/CacheDB/LFU';




let app = new Nawa({
    skipWaiting:true,
    debug:true,
    whitelist:[/whitelist\/index\.html/],
    cache:{
        name:"whiteList"
    }
});

app.cacheUpdate({
    path:/whitelist\/index\.html/,
    origin:"localhost:8080"
});

