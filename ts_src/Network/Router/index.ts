'use strict';

import Route from './route';
import helpers from '../../lib';
import syncMiddleware from '../../lib/middleware/syncController';
import asyncMiddleware from '../../lib/middleware/asyncController';

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
export default class Router {
    private routes = new Map();

    constructor() {

        this
            .routes
            .set(RegExp, new Map());

        this.bindMethod();
        self.addEventListener('fetch',this.fetchListener);
        
    }
    fetchListener=(event)=>{
        // extract the listener event
        let handler = this.match(event.request);

        let store = {
            req:event.requset,
            request:event.request
        }

        if(handler){
            syncMiddleware.execute(store,()=>{
                event.respondWith(asyncMiddleware.execute(store,()=>{
                    return handler(event.request);
                }))
            })
        }
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
    public add(method, path, handler, options) {
        options = options || {};

        // the origin should be string or regexp
        let origin = options.origin || self.location.origin;
        if (origin instanceof RegExp) {
            origin = origin.source;
        } else {
            origin = this.regexEscape(origin);
        }

        method = method.toLowerCase();

        // init Route, treat this as a key
        let route = new Route(method, path, handler, options);

        if (!this.routes.has(origin)) {
            // add origin
            this
                .routes
                .set(origin, new Map());
        }

        // get the route of this origin
        let methodMap = this
            .routes
            .get(origin);

        if (!methodMap.has(method)) {
            methodMap.set(method, new Map());
        }

        let routeMap = methodMap.get(method);
        let regExp = route.path;

        if (routeMap.has(regExp.source)) {
            helpers.debug('"' + path + '" resolves to same regex as existing route.');
        }

        routeMap.set(regExp.source, route);

    }
    public syncUse(middleware:Function){
        syncMiddleware.add(middleware);
    }
    public use(middleware:Function){
        asyncMiddleware.add(middleware);
    }

    /**
   * Entry
   * get the handle of specific route, like cacheFirst
   * @param {Request} request fetch_request
   */
    public match(request):Function | null {
        return this.matchMethod(request.method, request.url) || this.matchMethod('any', request.url);
    }
    /**
   *
   * @param {String} method get|post|...
   * @param {Map} methodMaps matched method with route Obj
   * @param {String} pathname pathname of url, like app/test
   */
    private extractMethod(method, methodMaps, pathname) {
        if (methodMaps.length === 0) {
            // the origin is not allowed
            return null;
        }

        for (let i = 0; i < methodMaps.length; i++) {
            let methodMap = methodMaps[i]; // get all method's Route specific to this origin

            let routeMap = methodMap && methodMap.get(method.toLowerCase());

            if (routeMap) {
                let routes = this.keyMatch(routeMap, pathname); // match the pathname using param.path

                if (routes.length > 0) {
                    // only get the first handle
                    return routes[0].makeHandler(pathname);
                }
            }
        }

        return null;
    }
    public matchMethod(method, url) {
        let urlObject = new URL(url);
        let origin = urlObject.origin;
        let path = urlObject.pathname;

        return this.extractMethod(method, this.keyMatch(this.routes, origin), path);
    }
    private keyMatch(map, string) {
        // This would be better written as a for..of loop, but that would break the
        // minifyify process in the build.
        let entriesIterator = map.entries();
        let item = entriesIterator.next();
        let matches = [];
      
        while (!item.done) {
          let pattern = new RegExp(item.value[0]);
      
          if (pattern.test(string)) {
            // item.value(1) is map type. {method, Contructor Route}, like: {get:
            // Route{regexp,method}}
            matches.push(item.value[1]);
          }
          item = entriesIterator.next();
        }
        return matches;
      }
      
      private regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      }

}

