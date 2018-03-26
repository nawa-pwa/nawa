## 简介

现在，随着 PWA 在前端慢慢普及，本身的支持性可以完美的运行在现代浏览器当中，例如，Chrome、Firefox、UC 和 X5。iv-pwa 的核心理念就是让离线应用能够在 Web 中得到真正的应用和实践。该库是基于 sw-toolbox API 设计，抽离了几个基本的缓存策略方法。


 - cacheFirst: 优先走缓存，并且检查当前缓存是否超过有效期限，默认值是 2 天，这里可以根据具体的文件来设置。
 - cacheFirstUpdate: 优先走缓存，并且会在每次返回缓存之后，额外进行后台更新。常常用于 HTML 资源文件。
 - cacheOnly: 只会走缓存，如果没有缓存，则会返回 undefined。该方法一般不常用。


另外，webpwa 经由 webpack 编译，支持 es6/7 的语法模式。基本特性有：

 - 可以根据域名和路径实现区分匹配
 - 支持缓存 HTML 的完全离线
 - 非 HTML 资源根据 hash 检测缓存
 - 可配置离线策略
 - 使用最新 ES6 的语法

![image.png-189.8kB](http://static.zybuluo.com/jimmythr/d14ax7dpgltf027ps37bw9l6/image.png)


## 安装

腾讯内部开发者，使用 tnpm 进行下载：

```
tnpm install webpwa --save
```

外部开发者，直接通过 npm 下载：

```
npm install webpwa --save
```

## 上手使用

在完成项目的 `install` 之后，现在我们主要针对一个项目 `now.qq.com/qq/market/index.html` 来做接入。大致可以分为，初始化和缓存设置两步。该项目有个特点，就是可以实现全部离线的效果，并且在二次打开时会默认使用上一次更新的 HTML。

```
import Webpwa from 'webpwa';

# 设置基本缓存表
const cacheDB = "now-content";

let pwaControl = new Webpwa({
  HTMLMatch: ['now.qq.com/qq/market/index.html'],
  cache: {
    name: cacheDB,
    maxAgeSeconds: 60 * 60 * 24 * 2, // 设置最大缓存时间
    maxEntries:150, // 设置最大缓存数量
    queryOptions: { // 设置缓存忽略的匹配
      ignoreSearch: true
    }
  }
});
```

接着，我们就需要具体对某些 CDN 资源和 HTML 进行相关缓存路由设置。

### 缓存 CDN 域名资源

一般在站点部署时候，都会用上 CDN 节点来加速资源的发布，比如，你将相关静态的 JS | CSS | PNG 资源放在 11.url.cn 域名下。并且针对业务不同，放置在不同路径上：

```
# 缓存 11.url.cn/now/lib 路径下的 js 和 css 资源文件
pwaControl.cacheFirst(/now\/lib\/.*\.(?:js|css).*/, {
  origin: "11.url.cn",
});

# 缓存 11.url.cn/now/qq 路径下的 js 和 css 资源文件
pwaControl.cacheFirst(/now\/qq\/.*\.(?:js|css|png|jpeg|jpg|webp).*/, {
  origin: "11.url.cn",
});
```

### 离线应用部署

所谓的离线不离线，简单来说就是你的 HTML 资源是否被缓存。这里，可以针对业务不同，来设置你是否对 HTML 资源的缓存。如果打算对当前 HTML 进行离线部署，可以使用 `cacheFirstUpdate` 策略，在返回缓存之后，再对资源进行一次更新。

```
# 缓存当前 HTML 资源
pwaControl.cacheFirstUpdate(/.*\.(?:html).*/, {
  origin: "now.qq.com",
});
```

## api 文档

[api docs](http://git.code.oa.com/jimmytian/webpwa/tree/master/docs)



## FAQ

1. 如果是跨域资源，请求里面一定需要带上 cross-origin 的属性。例如：

```
<script type="text/javascript" crossorigin="anonymous" src="//11.url.cn/now/h5/index_ddc256d.js?_bid=152"></script>
```


## tnpm 发布

输入账号密码：

 - UserName 输入 ivwebteam_at_tencent
 - Password 输入 123456
 - Email 输入 ivwebteam@tencent.com

然后，运行下列命令即可：

```
tnpm run release
```

## 开发项目参考

[pwa-qq](http://git.code.oa.com/ivweb/now-qq-pwa)
