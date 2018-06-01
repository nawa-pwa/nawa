/// <reference path="./index.d.ts" />

import Router from './Router/index';
import store from '../Store';

export default class Network extends Router {
    private param : globalOptions = {
        maxEntry: 100
    }
    public db;

    constructor(param : globalOptions) {
        super()
        Object.assign(this.param, param);
        this.db = store.cache;
    }
    public cacheFirst(param : routerOptions) {
        let {path, origin, query} = param;
        super.get({path, handler: this.db.cacheFirst.bind(this.db), origin, query});
    }
    public networkFirst(param : routerOptions) {
        let {path, origin, query} = param;
        super.get({path, handler: this.db.networkFirst.bind(this.db), origin, query});
    }
   
    public cacheUpdate(param : routerOptions) {
        let {path, origin, query} = param;
        super.get({path, handler: this.db.cacheUpdate.bind(this.db), origin, query});
    }

}