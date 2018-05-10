import SWShell from 'SWShell'
import CacheFirst from 'Stragety/CacheFirst'

let sw = new SWShell({
    skpWaiting:true
});


// middleware test case
const app = new Network()

app.syncUse(({req},next)=>{
    next();
})

app.use(async (ctx,next)=>{
    await next()

    return ctx.response;
})



// router test case
app.get({
    path:/now\/lib\/.*\.(?:js|css).*/,
    origin: "www.qq.com",
    stragety:CacheFirst()
})

//stragety test case
class FetchFirst extends Stragety{
    main(request){
        return fetch(request)
    }
}

// Router test case






