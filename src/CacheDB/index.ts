import LFU from './LFU';


interface globalOptions {
    name?:string,
    maxEntry?: number;
    query?: {
        ignoreSearch: boolean
    }
}

export default class CacheDB {
    private sucReg = /^0|([123]\d\d)|(40[14567])|410$/;
    private lfu;
    private DBName ="NAWA-DB"
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

            await cache.put(request,response);

            // save the record
            let urls = await this.lfu.add(request.clone());

        }

        return response.clone();
    }
    async cacheFirst(){
        
    }
}


