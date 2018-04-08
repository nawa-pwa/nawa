'use strict';

import options from './options';
import router from './router';
import middleware from './middleware/mdControler';

var helpers = require('./helpers');

// Event listeners

function fetchListener(event) {
  var handler = router.match(event.request);

  if (handler) {
    middleware.execute(event.request,()=>{
      event.respondWith(handler(event.request))
    })

  } else if (router.default &&
    event.request.method === 'GET' &&
    // Ensure that chrome-extension:// requests don't trigger the default route.
    event.request.url.indexOf('http') === 0) {
    event.respondWith(router.default(event.request));
  }
}

function activateListener(event) {
  helpers.debug('activate event fired');
  var inactiveCache = options.cache.name + '-inactive-';
  event.waitUntil(helpers.renameCache(inactiveCache, options.cache.name));
}

function flatten(items) {
  return items.reduce(function(a, b) {
    return a.concat(b);
  }, []);
}

function installListener(event) {

  var inactiveCache = options.cache.name + '-inactive-';
  helpers.debug('install event fired');
  helpers.debug('creating cache [' + inactiveCache + ']');

  if(options.forceUpdate){
    self.skipWaiting();
  }


  event.waitUntil(
    helpers.openCache({cache: {name: inactiveCache}})
    .then(function(cache) {
      return Promise.all(options.preCacheItems)
      .then(flatten)
      .then(helpers.validatePrecacheInput)
      .then(function(preCacheItems) {
        helpers.debug('preCache list: ' +
              (preCacheItems.join(', ') || '(none)'));
        return cache.addAll(preCacheItems);
      });
    })
  );
}

module.exports = {
  fetchListener: fetchListener,
  activateListener: activateListener,
  installListener: installListener
};
