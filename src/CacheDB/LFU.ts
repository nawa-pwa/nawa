import idb from 'idb';

export default class LFU{
    private DBName:string ;
    private StoreName:string = "LFU";
    private DBIndexUsage:string = "usage";
    private DBIndexDate:string="date";
    private deletePercent:number = 0.4; // remove 20% files
    private maxCounts:number;
    private ignoreSearch:boolean;
    constructor(maxCounts:number, ignoreSearch=true,DBName){
        this.maxCounts = maxCounts || 100;
        this.ignoreSearch = ignoreSearch;
        this.DBName = DBName || "NAWA-DB";
    }
    private getDB(){
        return idb.open(this.DBName,1,upgradeDB=>{
             switch(upgradeDB.oldVersion){
                 case 0:
                 case 1:
                     let store = upgradeDB.createObjectStore(this.StoreName,{
                         keyPath:"url",
                     });
                     store.createIndex(this.DBIndexUsage,this.DBIndexUsage,{unique:false});
                     store.createIndex(this.DBIndexDate,this.DBIndexDate,{unique:false});
             }
         })
     }

    public async count(){
        let db = await this.getDB();
        let tx:any = db.transaction(this.StoreName,"readonly")
        let store = tx.objectStore(this.StoreName);
        return store.count();
    }
    // check whether the cacheStorage is full or not
    // the length of indexDB is more than this.counts
    private isFull():Promise<boolean>{
        // reach the counts or the maxSize
        return this.count()
        .then(length=>{
            return length > this.maxCounts;
        })
    }
    private regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
    private ignoreSearchURL(url:string=''){
        let link = new URL(url),
        search = link.search;

        return url.replace(new RegExp(this.regexEscape(search),'i'),'');
    }
    /**
     * delete 20% of cacheFiles, and return the urls need to be removed
     */
    public async LFUdelete():Promise<Array<string>>{
        let db = await this.getDB();

        let tx = db.transaction(this.StoreName,"readwrite");
        let store = tx.objectStore(this.StoreName);
        let length = await store.count();
        let needToRemove =Math.max(length,this.maxCounts) - this.maxCounts + Math.floor(length * this.deletePercent);

        let urls = [];

        length > this.maxCounts && store.index(this.DBIndexUsage)
        .openCursor().then(function cursorOper(cursor){
            if(cursor){
                let url = cursor.value['url'];
                urls.push(url);  
                console.log(urls);                            
                cursor.delete();

                if(urls.length < needToRemove){
                    cursor.continue().then(cursorOper)
                }
            }

        });

        return tx.complete.then(()=> urls);
    }

    private async idbAdd(data:LFUStoreDB):Promise<void>{
        let db = await this.getDB();
        let tx = db.transaction(this.StoreName,'readwrite');
        let store = tx.objectStore(this.StoreName);

        store.put(data);
        return tx.complete;
    }
    private async idbGet(url:string){
        let db = await this.getDB();

        return db.transaction(this.StoreName)
        .objectStore(this.StoreName).get(url);

    }
    /**
     * after get response, when it has already existed, just update it.
     * otherwise, check the DB is full or not.
     * @return:
     *      full: Array[string], the urls need to be deleted
     *      idle: Array[], empty array, the length === 0   
     *      
     */
    public async add(request:Request):Promise<Array<string>>{
        let {url,method,referrer} = request;
        method = method.toLowerCase();

        if(this.ignoreSearch){
            url = this.ignoreSearchURL(url);
        }
        let data = await this.idbGet(url);
        let deleteList:Array<string> = [];
        if(data){
            data.usage++
        }else{
            if(await this.isFull()){
                deleteList = await this.LFUdelete();
            }
            data = {
                url,
                method,
                referrer:referrer,
                date:Date.now(),
                usage:1
            }
        }

        return this.idbAdd(data).then(()=>deleteList);

    }
    /**
     * update the record 
     * and remove some records when reach the maximum value of storage
     * @param request Request
     * @param cache Cache
     */
    public async update(request:Request,cache:Cache){
        let urls = await this.add(request);

        urls.length && await Promise.all(urls.map(url=>{
            return cache.delete(url,{ignoreSearch:true});
        }));


    }

}
