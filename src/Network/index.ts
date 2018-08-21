/// <reference path="./index.d.ts" />

import Router from './Router/index';
import store from '../Store';

export default class Network extends Router {
  
    constructor() {
        super()
    }
    public cacheFirst(urlToMatch:RegExp,options?:routerOptions) {
        
        super.get(urlToMatch,(request)=>{
            return store.cache.cacheFirst(request,options)
        });
    }
    public networkFirst(urlToMatch:RegExp,options?:routerOptions) {
        super.get(urlToMatch,(request)=>{
            return store.cache.networkFirst(request,options)
        });
    }
    public cacheUpdate(urlToMatch:RegExp,options?:routerOptions) {
        super.get(urlToMatch,(request)=>{
            return store.cache.networkFirst(request,options)
        });
    }

}