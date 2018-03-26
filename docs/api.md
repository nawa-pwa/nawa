## 构造函数

通过 import 导入的 WebPWA，其构造函数参数:

```
Consturctor WebPWA: globalOption{
    cache: {Object} CacheOptions,
	timeout: {Number} 3000 [option],
	debug: {Boolean} false [option],
	forceUpdate: {Boolean} true [option],
    HTMLMatch: {Array} [],
}

CacheOptions {
    name: {String} , 
    maxAgeSeconds: {Number} 172800 [option], 
    maxEntries: {Number} 150 [option], 
    queryOptions: {Object} QueryOptions [option], 
}

QueryOptions{
    ignoreSearch: {boolean} false;
    ignoreMethod: {boolean} false;
    ignoreVary: {boolean} false;
}

```

 - cache: 用来进行 CacheStorage 缓存设置。可设置参数为：CacheOptions
    - name: cacheStorage 的缓存表名
    - maxAgeSeconds: 缓存资源最大的缓存时间，如果超过这个时间，会默认被清除，并且重新获取。
    - maxEntries: 当前缓存表最大的缓存数量
    - queryOptions: 设置 cache.match() 匹配缓存的具体策略。
        - ignoreSearch： 忽略 query 的匹配
 - forceUpdate: 如果存在新的 sw 时，是否执行强制更新。
 - HTMLMatch: 白名单域名设置，主要通过 referrer 头进行判断。默认，则是设置和 sw.js 同路径下的 html. 比如 `https://now.qq.com/sw.js`，则默认白名单为 `https://now.qq.com/index.html`
 - timeout: 通过 fetch 请求网络资源的最大等待时间，通常和 NetWorkFirst 策略搭配使用。默认可以设。
 - debug: 输出通过 helper.debug(xxx) 的信息。
 
比如，最基本的自定义参数为：

```
const cacheDB = "now-content";

let pwaControl = new PWALib({
  HTMLMatch: ['now.qq.com/qq/market/index.html'],
  debug:true,
  cache: {
    name: cacheDB,
    maxAgeSeconds: 60 * 60 * 24 * 2, // 2 days
    maxEntries:150,
    queryOptions: {
      ignoreSearch: true
    }
  }
});
```

## 挂载方法

基本挂载的方法主要有：

```
Constructor PWALib{
    void cacheFirst(Regexp path, Object options);
    void cacheFirstUpdate(Regexp path, Object options);
    void cacheOnly(Regexp path, Object options);
    void precache(Array urls);
}
```

其中路由匹配方法里面参数很重要，第一个是用来接收的 pathname 的正则表达式，用来匹配请求的 pathname 部分。

```
# 只匹配 11.url.cn/now/qq 路径下的 js 和 css 资源文件
# 比如：匹配 11.url.cn/now/qq/lib.js、1.url.cn/now/qq/lib.css 文件内容
pwaControl.cacheFirst(/now\/qq\/.*\.(?:js|css|png|jpeg|jpg|webp).*/, {
  origin: "11.url.cn",
});

```

 - cacheFirst: 优先走缓存，并且检查当前缓存是否超过有效期限，默认值是 2 天，这里可以根据具体的文件来设置。常常针对的是 JS 等静态资源。
 - cacheFirstUpdate: 优先走缓存，并且会在每次返回缓存之后，额外进行后台更新。常常用于 HTML 资源文件。
 - cacheOnly: 只会走缓存，如果没有缓存，则会返回 undefined。该方法一般不常用。
 - precache: 在 `install` 阶段，设置预先需要缓存的内容。


### 参数说明

#### 缓存方法参数

在使用具体缓存策略时，具体的缓存参数都是一致的。

```
void cacheFirst(Regexp path, Object options);
void cacheFirstUpdate(Regexp path, Object options);
void cacheOnly(Regexp path, Object options);
```

 - path[Regexp]: 用来设置具体匹配的 pathname 路径名和文件资源。
 - options: 用来确定该次请求相关的匹配参数。

options 里面具体可设置参数如下：

```
Option {
    origin: String || RegExp, // default is location.href
    networkTimeoutSeconds: Number, // 通过线上请求时，最大等待时间
  }
```