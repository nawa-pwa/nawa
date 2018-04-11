/**
 * @noWrap
 */

import Nawa from '../src';

// 设置基本缓存表
const cacheDB = "now-content";

let pwaControl = new Nawa({
	whiteList: [
    'shangfen.qq.com/app/appeal/writeappeal.html',
    'shangfen.qq.com/app/appeal/details.html'
  ],
  cache: {
    name: cacheDB,
    maxAgeSeconds: 60 * 60 * 24 * 2, // 2 days
    maxEntries:150,
    queryOptions: {
      ignoreSearch: true
    }
  }
});



// for lib css,js
pwaControl.cacheFirst(/now\/lib\/.*\.(?:js|css).*/, {
  origin: "11.url.cn",
});

// for main index.js
pwaControl.cacheFirst(/now\/app\/.*\.(?:js|css|png|jpeg|jpg|webp).*/, {
  origin: "11.url.cn",
});
