'use strict';
/// <reference path="../index.d.ts" />

import Route from './route';
import {debug,urls} from '../../Lib';
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
        self.addEventListener('fetch', this.fetchListener);

    }
    private fetchListener = (event) => {
        // extract the listener event
        let store = {
            req: event.requset,
            request: event.request
        }

        debug(`event request is ${event.request.url} and mode is ${event.request.mode}`);

        syncMiddleware.execute(store, () => {

            let handler = this.match(event.request);
            
            debug(`handle is ${handler}` );
            handler && event.respondWith(asyncMiddleware.execute(store, async (ctx) => {

                debug(`handle to resolve the req, ${event.request.url}`);
                // don't delete the code
                ctx.response = await handler(event.request);
            }))
        })
    }
    /**
     * when throw error, clear all variable and remove listeners
     */
    public revoke():void{
        self.removeEventListener('fetch',this.fetchListener);
        this.routes = null;
    }


    public get(routePath: RegExp, handler: RequestHandler){

        
    }
    public post(param : routerOriginOpt) {
        let {path, handler} = param;
        return this.add("post", path, handler, param);
    }
    public put(param : routerOriginOpt) {
        let {path, handler} = param;
        return this.add("put", path, handler, param);
    }
    public delete(param : routerOriginOpt) {
        let {path, handler} = param;
        return this.add("delete", path, handler, param);
    }
    public any(param : routerOriginOpt) {
        let {path, handler} = param;
        return this.add("any", path, handler, param);
    }
    /**
   * bind requesting method, like get post
   * @param {String} method get | post | put | delete | any
   * @param {String} path
   * @param {Event} handler
   * @param {Object} options
   */
    private add(method:MethodDes, routePath:RegExp, handler) {
        

        // the origin should be string or regexp
        
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
            debug('"' + path + '" resolves to same regex as existing route.');
        }

        routeMap.set(regExp.source, route);

    }

    public add(method:MethodDes,hrefReg:RegExp, handler:RequestHandler,options:object){
        let route = new Route(method,handler,options);
        
        !this.routes.has(method) && this.routes.set(hrefReg,new Map());

        let routeMap = this.routes.get(method);

        routeMap.set(hrefReg,route);
    }

    public syncUse(middleware : syncMiddleware) {
        syncMiddleware.add(middleware);
    }
    public use(middleware : asyncMiddleware) {
        asyncMiddleware.add(middleware);
    }

    /**
   * Entry
   * get the handle of specific route, like cacheFirst
   * @param {Request} request fetch_request
   */
    private match(request) : Function | null {
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
    private matchMethod(method, url) {
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
