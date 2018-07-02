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

这里的中间件，分为同步中间件和异步中间件。

 - asyncUse: 同步中间件
 - use: 异步中间件

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


### whitelist 白名单匹配

通过 NAWA.whitelist 设置白名单机制，检验其是否会捕获到子 HTML 里面的请求内容。


### 检查 DIY middleware 的模式


### DIY kernel Function

