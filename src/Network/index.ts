/// <reference path="./index.d.ts" />

import Router from './Router/index';
import CacheDB from '../CacheDB';

export default class Network extends Router {
    private param : globalOptions = {
        maxEntry: 100
    }
    private db;

    constructor(param : globalOptions) {
        super()
        Object.assign(this.param, param);
        this.db = new CacheDB(this.param);
    }
    public cacheFirst(param : routerOptions) {
        let {path, origin, query} = param;
        super.get({path, handler: this.db.cacheFirst, origin, query});
    }
    public cacheOnly(param : routerOptions) {
        let {path, origin, query} = param;
        super.get({path, handler: this.db.cacheOnly, origin, query});
    }
    public networkFirst(param : routerOptions) {
        let {path, origin, query} = param;
        super.get({path, handler: this.db.networkFirst, origin, query});
    }
    public networkOnly(param : routerOptions) {
        let {path, origin, query} = param;
        super.get({path, handler: this.db.networkOnly, origin, query});
    }
    public fastest(param : routerOptions) {
        let {path, origin, query} = param;
        super.get({path, handler: this.db.fastest, origin, query});
    }
    public cacheUpdate(param : routerOptions) {
        let {path, origin, query} = param;
        super.get({path, handler: this.db.cacheUpdate, origin, query});
    }

}