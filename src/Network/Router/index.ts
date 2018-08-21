'use strict';
/// <reference path="../index.d.ts" />

import Route from './route';
import {debug} from '../../Lib';
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
        this.add('get',routePath,handler);
    }
    public post(routePath: RegExp, handler: RequestHandler){
        this.add('post',routePath,handler);
    }
    public put(routePath: RegExp, handler: RequestHandler){
        this.add('put',routePath,handler);
    }
    public delete(routePath: RegExp, handler: RequestHandler){
        this.add('delete',routePath,handler);
    }
    public any(routePath: RegExp, handler: RequestHandler){
        this.add('any',routePath,handler);
    }   

    public add(method:MethodDes,hrefReg:RegExp, handler:RequestHandler,options?:object){
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
   * @return null
   */
    private match(request) : Function | null {
        let route = this.matchMethod(request.method, request.url) || this.matchMethod('any', request.url);

        route && (route = route.makeHandler());

        return route
    }
   
    private matchMethod(method, url) {
        let methodMap = this.routes.get(method);

        if(!methodMap) return null;
        
        return this.matchRoute(methodMap,url);
    }
    private matchRoute(routesMap,url){
        let routesIterator = routesMap.entries();
        let item = routesIterator.next();

        while(!item.done){
            let pattern = item.value[0];

            if(pattern.test(url)){
                return item.value[1]
            }
            item = routesIterator.next();
        }

        return null;
    }
    
    /**
     * @param s String
     * @description transfer the regexp's string, in order to be used for new Regexp()
     */
    private regexEscape(s:string) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

}
