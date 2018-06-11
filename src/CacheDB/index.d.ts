
/**
 * the `LFUIndexDB` is the data structure of indexDB. 
 * @primaryKey: url
 * @index: usage
 */
interface LFUIndexDB{
    url: string, // keyPath
    usage: number, //index, usage times, used for LRU
    date: number, // index, timestamps, used for LFU
    fileDate: number, // last-modified timestamp
    method: string, // get | put | post | any
    // size: number, // Bytes, TODO: size = request.size + response.size
}


declare class LFU {
    private DBName : string;
    private StoreName : string;
    private DBIndexUsage : string;
    private deltePercent : number;
    private getDB:Promise<any>;
    /**
     * get the length of records in indexDB
     */
    public count():Promise<number>;
    /**
     * delete the records of specific deletePercent in indexDB
     * and return the result which has been removed
     */
    public delete():Promise<Array<string>>;
    /**
     * update or add the request's records in indexDB when return the data to client.
     * And when the indexDB is full ,return the urls needed to be removed
     * @param request Request
     */
    public add(request:Request):Promise<Array<string>>;
    /**
     * especially, just like the combination of `add` and `delete` method.
     * it will update the record and delete the record when the indexDB is full
     * @param request Request
     * @param cache Cache
     */
    public update(request:Request,cache:Cache):Promise<void>;
}

interface globalOptions {
    name?: string,
    maxEntry?: number;
    timeout?: number; // default is 3
    query?: {
        ignoreSearch: boolean
    }
}
declare class CacheDB {
    constructor(param : globalOptions)
    private sucReg:RegExp; // successful response regexp
    private lfu : LFU;
    public precacheUrl(url):Promise<void> 
    public fetchAndCache(request:Request):Promise<Response> 
    public cacheFirst(request:Request):Promise<Response>
    public networkFirst(request:Request):Promise<Response | {}>
    public cacheUpdate(request:Request):Promise<Response>
}



