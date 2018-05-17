import Router from './Router/index';
import CacheDB from '../CacheDB';

interface globalOptions {
    DBName?: string,
    maxEntry?: number;
    query?: {
        ignoreSearch: boolean
    }
}

interface routerOptions {
    path: string;
    origin: string | RegExp;
    cacheDB?: string;
    maxEntry?: number;
    query?: {
        ignoreSearch: boolean
    }

}

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
    cacheFirst(param:routerOptions) {
        super.get(param.path, this.db.cacheFirst,param);
    }
    cacheOnly(param:routerOptions) {
        super.get(param.path,this.db.cacheOnly,param);
    }
    networkFirst(param:routerOptions) {
        super.get(param.path,this.db.networkFirst,param);
    }
    networkOnly(param:routerOptions) {
        super.get(param.path,this.db.networkOnly,param);
    }
    fastest(param:routerOptions) {
        super.get(param.path,this.db.fastest,param);
    }
    cacheUpdate(param:routerOptions) {
        super.get(param.path,this.db.cacheUpdate,param);
    }

}