import Nawa from '../../src';
import LFU from '../../src/CacheDB/LFU';




let app = new Nawa({
    skipWaiting:true,
    debug:true,
    cache:{
        name:"RouteTest"
    }
});


app.cacheFirst({
    path:/now\/lib\/smiley_.*\.png/,
    origin:"11.url.cn"
});

// html
// cacheUpdate
app.cacheUpdate({
    path:/nearyby-index\/(.*)\.html/,
    origin:"nearby.qq.com"
})



