/**
 * @noWrap
 */

import PWALib from '../src';

const cacheDB = "now-content";

let pwaControl = new PWALib({
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

pwaControl.use((request,next)=>{
    let {
        mode,
        url,
      } = request;
    
      // check that the requst is HTML or not
    if(!(/^http.*\.html/.test(url) && mode==="navigate")){
        // the request type is not HTML 
        next();
    }
})

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



