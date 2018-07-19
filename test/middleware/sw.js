import Nawa from '../../src';

let app = new Nawa({
    skipWaiting:true,
    debug:true,
    cache:{
        name:"middleware-db"
    },
});


app.cacheFirst({
    origin:"localhost:8080",
    path:/middleware\/.*\.js/,
});


app.syncUse((ctx,next)=>{
    let {request} =  ctx;
    next();
})

app.use(async (ctx,next)=>{
    let {request} = ctx;

    await next();

    let {response} = ctx;
})