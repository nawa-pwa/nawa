
interface CacheDB {
    new(param : object)
    openCache(name : string) : Cache;
    fetchAndCache(request : Request) : Response;
    save(request : Request, response : Response, cache : Cache) : Promise < boolean >;
    isResponseFresh(); // 检查响应是否更新
}

interface CacheDBKeys {
    id: number, // primary key
    url: string, // index,unique : false
    usage: number, // usage times
    fileDate: number, // last-modified timestamp
    date: number, // timestamps
    size: number, // Bytes
}


// you can choose the style for LFU, like, size-LFU or count-LFU
// And you can just pass the counts or maxSize
interface LFU {
    new (counts?:number,maxSize?:number)
    
    // check the cacheStorage is full or not,
    // if it is full, then return urls which needed to be removed
    isfull():Promise<Array<string>>; 
    delete(url:Array<string>):Promise<boolean>;
    add(request):Promise<boolean>; // update or add it
}