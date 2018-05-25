# Test Case

### precache Feature

```
let app = new Nawa({
    precache:[
    'shangfen.qq.com/app/appeal/writeappeal.html',
    'shangfen.qq.com/app/appeal/details.html'
        ]
})
```

### cache Setting

```
let app = new Nawa({
    cache:{
        name:"xxxx",
        maxEntry:1000
    }
})
```


### middleware


#### use

```
app.use(async (ctx,next)=>{
    let A = Data.now();
    await next();
    console.log("cost time is: " + (Data.now() - A));
})
```

#### syncUse

```
app.syncUse((ctx,next)=>{
    let {request} = ctx;

    let {url} = request;

    if(/\.html(.*)/.test(url)){
        next()
    }
})
```

### stragety


