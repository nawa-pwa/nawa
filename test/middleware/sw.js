import Nawa from '/';

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