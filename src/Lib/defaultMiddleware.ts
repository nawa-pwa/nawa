/// <reference path="../Network/index.d.ts" />

import store from '../Store';
import {debug} from './index';

class defaultMiddleware {
    /**
     * default sync MiddleWare
     * @param ctx middlewareObj
     * @param next Function
     */
    public middlewareWhitelist(ctx : middlewareObj, next : Function) {
        let {request} = ctx;
        if (this.checkReq(request)) 
            next();
        }
    /**
     * default sync MiddleWare
     * @param ctx middlewareObj
     * @param next Function
     */
    public isServiceWorker(ctx : middlewareObj, next : Function) {
        let {request} = ctx;
        if (!this.swCheck(request)) 
            next();
        }
    public bypassNetwork(ctx : middlewareObj, next : Function) {
        let {request} = ctx;
        let {referrer} = request,
            query = new URL(referrer).searchParams;

        if (query.get('_pwa') != '0') {
            // when the url's query contain _pwa=0, then skip sw
            next();
        }

    }
    private swCheck(req : Request) {
        let {url} = req;

        return store
            .filename
            .test(url);
    }
    private checkReq(req : Request) : boolean {
        let {referrer, mode, url} = req;

        debug(`url is ${url}, \n\r, mode is ${mode}`);

        if (referrer) {
            // check the requet is inwhiteList, and same-origin or cors
            // && this.corsCheck(mode, url)
            if (this.inWhiteList(store.whitelist, referrer)) {
                return true;
            }
        } else {
            // if the request's type is HTML then, check the url is in whiteList
            if (this.isHTML(url, mode) && this.inWhiteList(store.whitelist, url)) {
                return true;
            }

        }

    }
    private inWhiteList(list : Array < RegExp >, url : string) : boolean {
        if(!url) 
            return false;
        
        for (var rule of list) {
            if (rule.test(url)) 
                return true;
            }
        }
    private isHTML(url : string, mode : RequestMode) {
        return /^http.*\.html/.test(url) && mode === "navigate";
    }

    /**
     * there is two way to check whether CacheStorage could cache response or not.
     * 1. when meet the same-origin request, pass it
     * 2. check the mode of request is cors (no-cors is default value)
     */
    private corsCheck(mode : RequestMode, url) {
        let origin = new URL(url).origin,
            swOrigin = self.location.origin;

        return origin === swOrigin || mode !== 'no-cors';
    }

}

export default new defaultMiddleware;