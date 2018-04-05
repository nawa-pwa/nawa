'use strict';

import options from './options';

var Route = require('./route');
var helpers = require('./helpers');


function regexEscape(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}


/**
 * @desc the method will be used in two way:
 *        1. check the origin whether request.origin is in specific origins
 *        2. check the pathname whether it is matched by option.path
 * 
 * @param {Set} map 
 * @param {url} string 
 */
var keyMatch = function (map, string) {
  // This would be better written as a for..of loop, but that would break the
  // minifyify process in the build.
  var entriesIterator = map.entries();
  var item = entriesIterator.next();
  var matches = [];

  while (!item.done) {
    var pattern = new RegExp(item.value[0]);

    if (pattern.test(string)) {
      // item.value(1) is map type. {method, Contructor Route}, like: {get: Route{regexp,method}}
      matches.push(item.value[1]);
    }
    item = entriesIterator.next();
  }
  return matches;
};

var Router = function () {
  this.routes = new Map(); // is a map
  // Create the dummy origin for RegExp-based routes
  this.routes.set(RegExp, new Map());
  this.default = null;
};

['get', 'post', 'put', 'delete', 'head', 'any'].forEach(function (method) {
  Router.prototype[method] = function (path, handler, options) {
    return this.add(method, path, handler, options);
  };
});

Router.prototype.add = function (method, path, handler, options) {
  options = options || {};

  // the origin should be string or regexp
  var origin = options.origin || self.location.origin;
  if (origin instanceof RegExp) {
    origin = origin.source;
  } else {
    origin = regexEscape(origin);
  }

  method = method.toLowerCase();

  var route = new Route(method, path, handler, options);

  if (!this.routes.has(origin)) {
    this.routes.set(origin, new Map());
  }

  var methodMap = this.routes.get(origin);
  if (!methodMap.has(method)) {
    methodMap.set(method, new Map());
  }

  var routeMap = methodMap.get(method);
  var regExp = route.regexp || route.fullUrlRegExp;

  if (routeMap.has(regExp.source)) {
    helpers.debug('"' + path + '" resolves to same regex as existing route.');
  }

  routeMap.set(regExp.source, route);

};

/**
 * 
 * @param {String} method get|post|put
 * @param {String} url the whole url
 */
Router.prototype.matchMethod = function (method, url) {
  var urlObject = new URL(url);
  var origin = urlObject.origin;
  var path = urlObject.pathname;
  // We want to first check to see if there's a match against any
  // "Express-style" routes (string for the path, RegExp for the origin).
  // Checking for Express-style matches first maintains the legacy behavior.
  // If there's no match, we next check for a match against any RegExp routes,
  // where the RegExp in question matches the full URL (both origin and path).

  /**
   * first keyMatch is to determine that request.origin is matched in origins 
   */
  return this._match(method, keyMatch(this.routes, origin), path);
};

Router.prototype._match = function (method, methodMaps, pathname) {
  if (methodMaps.length === 0) {
    // the origin is not allowed
    return null;
  }


  for (var i = 0; i < methodMaps.length; i++) {
    var methodMap = methodMaps[i]; // get all method's Route specific to this origin

    var routeMap = methodMap && methodMap.get(method.toLowerCase());

    if (routeMap) {
      var routes = keyMatch(routeMap, pathname); // match the pathname using param.path

      if (routes.length > 0) {
        return routes[0].makeHandler(pathname);
      }
    }
  }

  return null;
};

Router.prototype.match = function (request) {
  // you can add the refer and crossorigin determination
  let {
    referrer,
    mode,
    url,
  } = request;


  if(!helpers.checkReq(request)){
    return null;
  }



  return this.matchMethod(request.method, request.url) ||
    this.matchMethod('any', request.url);
};

module.exports = new Router();