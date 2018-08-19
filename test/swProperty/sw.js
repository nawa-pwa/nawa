import Nawa from '../../src';
import LFU from '../../src/CacheDB/LFU';




let app = new Nawa({
    skipWaiting:true,
    debug:true,
    cache:{
        name:"RouteTest"
    }
});

app.cacheUpdate({
    path:/now\/lib\/smiley_.*\.png/,
    origin:"11.url.cn"
});

app.cacheFirst({
    path:/now\/lib\/.*\.js/,
    origin:"11.url.cn"
});
