import idb from 'idb';

export default class LFU{
    private DBName:string = "NAWA-DB";
    private StoreName:string = "lFU";
    private DBIndexUsage:string = "usage";
    private deltePercent:number = 0.2; // remove 20% files
    private getDB:Promise<any>;


    constructor(private counts:number = 100, private maxSize:number = 200){
        this.getDB = this.buildDB();
    }

    public async count(){
        let db:IDBDatabase = await this.getDB;

        let tx:any = db.transaction(this.DBName,"readonly")
        let store = tx.objectStore(this.StoreName);
        let length = await store.count();

        return tx.complete.then(()=>length);
    }
    // check whether the cacheStorage is full or not
    // the length of indexDB is more than this.counts
    public async isFull():Promise<boolean>{
        // reach the counts or the maxSize
        return this.count()
        .then(length=>{
            return length > this.counts;
        })
    }
    /**
     * delete 20% of cacheFiles, and return the urls need to be removed
     */
    public async delete():Promise<Array<string>>{
        let db = await this.getDB;

        let tx = db.transaction(this.DBName,"readwrite");

        let length = await this.count();

        let needToRemove = Math.floor(length * this.deltePercent);

        let urls = [];

        let store = tx.objectStore(this.StoreName);

        store.index(this.DBIndexUsage)
        .openCursor().then(function cursorOper(cursor){
            if(cursor){
                let url = cursor.value['url'];
                urls.push(url);
                
                cursor.delete();

                if(urls.length < needToRemove){
                    cursor.continue().then(cursor)
                }
            }

        });

        return tx.complete.then(()=> urls);

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
        let db = await this.getDB;

        let tx = db.transaction(this.DBName,'readwrite');

        let store = tx.objectStore(this.StoreName);

        let {url,method} = request;

        let record = await store.get(url);

        let urls = [];

        if(record){
            record.usage++;

            store.put(record, url);
        }else{

            if(await this.isFull()){
                urls = await this.delete();
            }

            // TODO: check the format of fileDate
            let fileDate = request.headers.get('Last-Modified');

            let date = Date.now();

            store.put({
                fileDate,
                date,
                method,
                usage:1,
            },url);

        }

       return tx.complete.then(()=>urls);
    }


    private buildDB(){
       return idb.open(this.DBName,1,upgradeDB=>{
            switch(upgradeDB.oldVersion){
                case 1:
                    let store = upgradeDB.createObjectStore(this.StoreName,{
                        keyPath:"url",
                    });
                    store.createIndex(this.DBIndexUsage,this.DBIndexUsage,{unique:false})
            }
        })

    }
}
