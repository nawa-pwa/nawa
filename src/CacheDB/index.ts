/// <reference path="./index.d.ts" /> 

import LFU from './LFU';


interface globalOptions {
    name?:string,
    maxEntry?: number;
    timeout?:number; // default is 3
    query?: {
        ignoreSearch: boolean
    }
}

export default class CacheDB {
    private sucReg = /^0|([123]\d\d)|(40[14567])|410$/;
    private lfu;
    private DBName ="NAWA-DB"
    private timeout = 3; // 3s for networkFirst stragety
    private query?:CacheQueryOptions={
        ignoreSearch:true
    };

    constructor(param:globalOptions) {

        let {query,maxEntry,name} = param;

        this.DBName = name || "NAWA-DB";

        Object.assign(this.query,query);

        this.lfu = new LFU(maxEntry);

    }
    open():Promise<Cache>{
        return caches.open(this.DBName);
    }
    async fetchAndCache(request):Promise<Response>{
        let response:Response = await fetch(request.clone());

        if(this.sucReg.test(String(response.status))){
            let cache = await this.open();
            // save the record and remove the urls when the cacheStorage is full
            await this.lfu.update(request.clone(),cache);
            await cache.put(request,response);

        }
        return response.clone();
    }
    /**
     * first search the cacheStorage
     * if find the cacheObj, return it and update its record
     * otherwise, return the fetch(res)
     * 
     * @param request Request
     */
    async cacheFirst(request:Request):Promise<Response>{

        let cache = await this.open();
        let response = await cache.match(request,this.query);

        if(response){
            // update its record
            // don't use <async> to speed up the response time
            this.lfu.update(request.clone(),cache);
            return response
        }
        // when don't get the response from cacheStroge
        // then return the response from fetch
        return this.fetchAndCache(request);

    }

    async networkFirst(request:Request):Promise<Response | {}>{
        let timeoutControl,
            cache = await this.open();

        let cacheResolve = new Promise((res,rej)=>{
            timeoutControl = setTimeout(() => {
                cache.match(request,this.query)
                .then(response=>{
                    this.lfu.update(request.clone(),cache);
                    res(response);
                })
            }, 3000 * this.timeout);
        });

        let network = this.fetchAndCache(request)
        .then(res=>{
            clearTimeout(timeoutControl);
            return res;
        });

        return Promise.race([cacheResolve,network]);
    }

    /**
     * first, get response from cacheStorage. 
     * if the response is effective,
     *  then return it and update the record through fetchAndCache
     * some resources often use the stragety, like .html
     * @param request Request
     */
    async cacheUpdate(request:Request):Promise<Response>{
        let cache = await this.open();
        let response = await cache.match(request,this.query);

        if(response){
            this.fetchAndCache(request.clone());
            return response
        }
        return this.fetchAndCache(request.clone());

    }
}


