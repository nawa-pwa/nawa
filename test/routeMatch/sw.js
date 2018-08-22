import Nawa from '../../src';

let app = new Nawa({
    skipWaiting:true,
    debug:true,
    cache:{
        name:"RouteTest"
    }
});

// always ignore query
app.cacheFirst(/11.url.cn\/now\/lib\/.*.png/,{
    maxAge: 60*60*24*2, // 2days
})
