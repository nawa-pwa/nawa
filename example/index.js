/**
 * @noWrap
 */

import PWALib from '../src';

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

// for lib css,js
pwaControl.cacheFirst(/now\/lib\/.*\.(?:js|css).*/, {
  origin: "11.url.cn",
});

// for main index.js
pwaControl.cacheFirst(/now\/qq\/.*\.(?:js|css|png|jpeg|jpg|webp).*/, {
  origin: "11.url.cn",
});


pwaControl.cacheFirst(/sdk\/.*\.(?:js).*/, {
  origin: "open.mobile.qq.com",
});


pwaControl.cacheFirstUpdate(/.*\.(?:html).*/, {
  origin: "now.qq.com",
});
