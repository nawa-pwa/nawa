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

基本挂载的

缓存方法调用的参数为：

```
Option {
    origin: String || RegExp, // default is location.href
    debug: Boolean,
    networkTimeoutSeconds: Number,
  }
```