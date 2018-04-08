'use strict';

import options from './options';
import Route from './route';
import helpers from './helpers';


/**
 * the routes is a map:
 *    @key: key is origin
 *    @value: value is also a Map
 *        @key {String} get|post|put|delete
 *        @value {Map}
 *          @key {Regexp.source} pathname
 *          @value {Route}
 *
 */
class Router {
  constructor() {
    this.routes = new Map();

    this
      .routes
      .set(RegExp, new Map());
    this.default = null;

  }
  bindMethod() {
    [
      'get',
      'post',
      'put',
      'delete',
      'head',
      'any'
    ].forEach(method => {
      this[method] = (path, handler, options) => {
        return this.add(method, path, handler, options);
      }
    })
  }
  /**
   * bind requesting method, like get post
   * @param {String} method get | post
   * @param {String} path
   * @param {Event} handler
   * @param {Object} options
   */
  add(method, path, handler, options) {
    options = options || {};

    // the origin should be string or regexp
    var origin = options.origin || self.location.origin;
    if (origin instanceof RegExp) {
      origin = origin.source;
    } else {
      origin = helpers.regexEscape(origin);
    }

    method = method.toLowerCase();

    // init Route, treat this as a key
    var route = new Route(method, path, handler, options);

    if (!this.routes.has(origin)) {
      // add origin
      this
        .routes
        .set(origin, new Map());
    }

    // get the route of this origin
    var methodMap = this
      .routes
      .get(origin);

    if (!methodMap.has(method)) {
      methodMap.set(method, new Map());
    }

    var routeMap = methodMap.get(method);
    var regExp = route.regexp || route.fullUrlRegExp;

    if (routeMap.has(regExp.source)) {
      helpers.debug('"' + path + '" resolves to same regex as existing route.');
    }

    routeMap.set(regExp.source, route);

  }
  /**
   * Entry
   * get the handle of specific route, like cacheFirst
   * @param {Request} request fetch_request
   */
  match(request) {
    // you can add the refer and crossorigin determination
    let {referrer, mode, url} = request;

    if (!helpers.checkReq(request)) {
      return null;
    }

    return this.matchMethod(request.method, request.url) || this.matchMethod('any', request.url);
  }
  /**
   *
   * @param {String} method get|post|...
   * @param {Map} methodMaps matched method with route Obj
   * @param {String} pathname pathname of url, like app/test
   */
  _match(method, methodMaps, pathname) {
    if (methodMaps.length === 0) {
      // the origin is not allowed
      return null;
    }

    for (var i = 0; i < methodMaps.length; i++) {
      var methodMap = methodMaps[i]; // get all method's Route specific to this origin

      var routeMap = methodMap && methodMap.get(method.toLowerCase());

      if (routeMap) {
        var routes = helpers.keyMatch(routeMap, pathname); // match the pathname using param.path

        if (routes.length > 0) {
          // only get the first handle
          return routes[0].makeHandler(pathname);
        }
      }
    }

    return null;
  }
  matchMethod(method, url) {
    var urlObject = new URL(url);
    var origin = urlObject.origin;
    var path = urlObject.pathname;

    return this._match(method, helpers.keyMatch(this.routes, origin), path);
  }

}

export default new Router;