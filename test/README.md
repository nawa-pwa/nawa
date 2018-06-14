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

### routeMatch 

routeMatch 主要是用来测试原始 Nawa 提供的 `cacheFirst` 和 `cacheUpdate` 方法内容。

 - cacheFirst 的预期结果为：返回是通过 SW 进行返回，并且 IndexDB 里面对应的 usage 记录会 +1
 - cacheUpdate 的预期结果为：返回的结果是 SW 返回，并且会额外进行一次请求进行更新。这里的 usage 为变为 +2.


