/// <reference path="./index.d.ts" />

import Router from './Router/index';
import store from '../Store';

export default class Network extends Router {
  
    constructor() {
        super()
    }
    public cacheFirst(param : routerOptions) {
        let {path, origin, query,maxAge} = param;
        super.get({path, handler: store.cache.cacheFirst.bind(store.cache), origin, query,maxAge});
    }
    public networkFirst(param : routerOptions) {
        let {path, origin, query,maxAge} = param;
        super.get({path, handler: store.cache.networkFirst.bind(store.cache), origin, query,maxAge});
    }
   
    public cacheUpdate(param : routerOptions) {
        let {path, origin, query,maxAge} = param;
        super.get({path, handler: store.cache.cacheUpdate.bind(store.cache), origin, query,maxAge});
    }

}