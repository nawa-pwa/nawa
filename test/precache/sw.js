import Nawa from '../../src';

let app = new Nawa({
    skipWaiting:true,
    debug:true,
});




app.syncUse((ctx,next)=>{
    let {request} =  ctx;

    console.log('trigger sync middleware A' );

    next();

    console.log('trigger sync middleware A' );
})

app.use(async (ctx,next)=>{
    let {reuqest} = ctx;

    await next();

    let {response} = ctx;
    console.log("cache is ", request);
})