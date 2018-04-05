'use strict';

import globalOptions from './options';

var idbCacheExpiration = require('./idb-cache-expiration');

function debug(message, options) {
  options = options || {};
  var flag = options.debug || globalOptions.debug;
  if (flag) {
    console.log('[sw-toolbox] ' + message);
  }
}

function openCache(options) {
  var cacheName;
  if (options && options.cache) {
    cacheName = options.cache.name;
  }
  cacheName = cacheName || globalOptions.cache.name;

  return caches.open(cacheName);
}

function fetchAndCache(request, options) {
  options = options || {};
  var successResponses = options.successResponses ||
    globalOptions.successResponses;

  return fetch(request.clone()).then(function (response) {
    // Only cache GET requests with successful responses.
    // Since this is not part of the promise chain, it will be done
    // asynchronously and will not block the response from being returned to the
    // page.
    if (request.method === 'GET' && successResponses.test(response.status)) {
      openCache(options).then(function (cache) {
        cache.put(request, response).then(function () {
          // If any of the options are provided in options.cache then use them.
          // Do not fallback to the global options for any that are missing
          // unless they are all missing.
          var cacheOptions = options.cache || globalOptions.cache;

          // Only run the cache expiration logic if at least one of the maximums
          // is set, and if we have a name for the cache that the options are
          // being applied to.
          if ((cacheOptions.maxEntries || cacheOptions.maxAgeSeconds) &&
            cacheOptions.name) {
            queueCacheExpiration(request, cache, cacheOptions);
          }
        });
      });
    }

    return response.clone();
  });
}

var cleanupQueue;

function queueCacheExpiration(request, cache, cacheOptions) {
  var cleanup = cleanupCache.bind(null, request, cache, cacheOptions);

  if (cleanupQueue) {
    cleanupQueue = cleanupQueue.then(cleanup);
  } else {
    cleanupQueue = cleanup();
  }
}

function cleanupCache(request, cache, cacheOptions) {
  var requestUrl = request.url;
  var maxAgeSeconds = cacheOptions.maxAgeSeconds;
  var maxEntries = cacheOptions.maxEntries;
  var cacheName = cacheOptions.name;

  var now = Date.now();
  debug('Updating LRU order for ' + requestUrl + '. Max entries is ' +
    maxEntries + ', max age is ' + maxAgeSeconds);

  return idbCacheExpiration.getDb(cacheName).then(function (db) {
    return idbCacheExpiration.setTimestampForUrl(db, requestUrl, now);
  }).then(function (db) {
    return idbCacheExpiration.expireEntries(db, maxEntries, maxAgeSeconds, now);
  }).then(function (urlsToDelete) {
    debug('Successfully updated IDB.');

    var deletionPromises = urlsToDelete.map(function (urlToDelete) {
      return cache.delete(urlToDelete);
    });

    return Promise.all(deletionPromises).then(function () {
      debug('Done with cache cleanup.');
    });
  }).catch(function (error) {
    debug(error);
  });
}

function renameCache(source, destination, options) {
  debug('Renaming cache: [' + source + '] to [' + destination + ']', options);
  return caches.delete(destination).then(function () {
    return Promise.all([
      caches.open(source),
      caches.open(destination)
    ]).then(function (results) {
      var sourceCache = results[0];
      var destCache = results[1];

      return sourceCache.keys().then(function (requests) {
        return Promise.all(requests.map(function (request) {
          return sourceCache.match(request).then(function (response) {
            return destCache.put(request, response);
          });
        }));
      }).then(function () {
        return caches.delete(source);
      });
    });
  });
}

function cache(url, options) {
  return openCache(options).then(function (cache) {
    return cache.add(url);
  });
}

function uncache(url, options) {
  return openCache(options).then(function (cache) {
    return cache.delete(url);
  });
}

function precache(items) {
  if (!(items instanceof Promise)) {
    validatePrecacheInput(items);
  }

  globalOptions.preCacheItems = globalOptions.preCacheItems.concat(items);
}

function validatePrecacheInput(items) {
  var isValid = Array.isArray(items);
  if (isValid) {
    items.forEach(function (item) {
      if (!(typeof item === 'string' || (item instanceof Request))) {
        isValid = false;
      }
    });
  }

  if (!isValid) {
    throw new TypeError('The precache method expects either an array of ' +
      'strings and/or Requests or a Promise that resolves to an array of ' +
      'strings and/or Requests.');
  }

  return items;
}

function isResponseFresh(response, maxAgeSeconds, now) {
  // If we don't have a response, then it's not fresh.
  if (!response) {
    return false;
  }

  // Only bother checking the age of the response if maxAgeSeconds is set.
  if (maxAgeSeconds) {
    var dateHeader = response.headers.get('date');
    // If there's no Date: header, then fall through and return true.
    if (dateHeader) {
      var parsedDate = new Date(dateHeader);
      // If the Date: header was invalid for some reason, parsedDate.getTime()
      // will return NaN, and the comparison will always be false. That means
      // that an invalid date will be treated as if the response is fresh.
      if ((parsedDate.getTime() + (maxAgeSeconds * 1000)) < now) {
        // Only return false if all the other conditions are met.
        return false;
      }
    }
  }

  // Fall back on returning true by default, to match the previous behavior in
  // which we never bothered checking to see whether the response was fresh.
  return true;
}

/**
 * detect whether CacheStorage could save this requst
 * @param {Request} request 
 */
function checkReq(request){
  let {
    referrer,
    mode,
    url,
  } = request;

  if(referrer){
    
    if(inWhiteList(globalOptions.whiteList,referrer) && corsCheck(mode,url)){
      return true;
    }
  }else{

    if(isHTML(url,mode)){
      return true;
    }

  }

}

/**
 * when capture HTML request, check the request 
 * @param {Array} list 
 * @param {Request} request
 */
function inWhiteList(list, url) {
  if (!url) return false;

  for (var rule of list) {
    if (rule.test(url)) return true;
  }

}

/**
 * there is two way to check whether CacheStorage could cache response or not.
 * 1. when meet the same-origin request, pass it
 * 2. check the mode of request is cors (no-cors is default value)
 */
function corsCheck(mode,url) {
  let origin = new URL(url).origin,
    swOrigin = self.location.origin;

    return origin === swOrigin || mode !== 'no-cors';
}


/**
 * @desc  get the default whiteList
 *        like: if the sw.js location is "https://now.qq.com/sw.js"
 *        then, it will return [/https:\/\/now.qq.com\/index.html/]
 * 
 */
function getDefaultWhiteList(origin,pathname){

  let pathArray = pathname.split('/');

  pathArray[pathArray.length-1] = 'index.html';

  let reg = new RegExp(origin + pathArray.join('/'));
    
  return [reg];
}


/**
 * 
 * @param {Array} lists convert string_value to Regexp
 */
export function stringToRegexp(lists){
  return lists.map(list=>{
    if(!(list instanceof RegExp)){
       list = new RegExp(list,'i');
    }
    return list;

  })
}

function isHTML(url,mode){
  return /^http.*\.html/.test(url) && mode==="navigate";
}




module.exports = {
  debug: debug,
  fetchAndCache: fetchAndCache,
  openCache: openCache,
  renameCache: renameCache,
  cache: cache,
  uncache: uncache,
  precache: precache,
  validatePrecacheInput: validatePrecacheInput,
  isResponseFresh: isResponseFresh,
  inWhiteList,
  corsCheck,
  getDefaultWhiteList,
  stringToRegexp,
  isHTML,
  checkReq,
};

