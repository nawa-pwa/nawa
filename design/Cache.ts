
interface CacheDB {
    DBName:string;
    sucReg: RegExp; // sucessful status of response
    openCache(name : string) : Cache;
    fetchAndCache(request : Request) : Response;
    save(request : Request, response : Response, cache : Cache) : Promise < boolean >;
    isResponseFresh(); // 检查响应是否更新

}

interface CacheDBKeys {
    url: string, // keyPath
    usage: number, //index, usage times
    fileDate: number, // last-modified timestamp
    date: number, // timestamps
    // size: number, // Bytes, TODO: size = request.size + response.size
    method: string, // get | put | post | any
}


// you can choose the style for LFU, like, size-LFU or count-LFU
// And you can just pass the counts or maxSize
interface LFU {
    new (counts?:number,maxSize?:number)
    getDB:Promise<Object>
    // check the cacheStorage is full or not,
    // if it is full, then return urls which needed to be removed
    isfull():Promise<Array<string>>; 
    delete():Promise<boolean>;
    add(request):Promise<boolean>; // update or add it

}