import LFU from './LFU';

export default class CacheDB {
    private DBName = "NAWA-DB";
    private sucReg = /^0|([123]\d\d)|(40[14567])|410$/;
    private lfu = new LFU();


    constructor() {

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
}