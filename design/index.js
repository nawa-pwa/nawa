import SWShell from 'SWShell'
import CacheFirst from 'Stragety/CacheFirst'

let sw = new SWShell({skpWaiting: true});

// middleware test case
const app = new Network()

app.syncUse(({
    req
}, next) => {
    next();
})

app.use(async(ctx, next) => {
    await next()

    return ctx.response;
})

// router test case
app.get({path: /now\/lib\/.*\.(?:js|css).*/, origin: "www.qq.com", stragety: CacheFirst()})

//stragety test case
class FetchFirst extends Stragety {
    main(request) {
        return fetch(request)
    }
}

// Router test case
const router = new Router()

router.add({method: "get", path: /now\/lib\/.*\.(?:js|css).*/, origin: "www.qq.com", stragety: CacheFirst()})

router.match(request)


//LFU

const lfu = new LFU();

lfu.add(request); // save id,url,usage,date,size

lfu.isFull().then((urls)=>{
    if(urls){
        // full
        lfu.delete(urls)
    }else{
        // save it
    }
});


// Entry

import Nawa from 'nawa'

const app = new Nawa({
    options
});

const {fetchAndCache,cacheFirst} = app.stragety;

app.use()

app.syncUse()

app.CacheFirst()

app.get({path: /now\/lib\/.*\.(?:js|css).*/, origin: "www.qq.com", stragety: CacheFirst})

import {Stragety,Cache} from 'nawa'




