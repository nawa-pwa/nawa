import idb from 'idb';

class LFU{
    private DBName:string = "nawa-db";
    private StoreName:string = "lFU";
    private deltePercent:number = 20; // remove 20% files
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
    public async isFull():Promise<boolean>{
        // reach the counts or the maxSize
        return this.count()
        .then(length=>{
            return this.counts > length;
        })
    }
    public async delete():Promise<void>{
        let db = await this.getDB;

        let tx = db.transaction(this.DBName,"readwrite");

        tx.objectStore(this.StoreName)
        .openCursor(cursor=>{
            if(!cursor) return;
        });



    }


    private buildDB(){
       return idb.open(this.DBName,1,upgradeDB=>{
            switch(upgradeDB.oldVersion){
                case 1:
                    let store = upgradeDB.createObjectStore(this.StoreName,{
                        keyPath:"id",
                        autoIncrement:true
                    });
                    store.createIndex("url","url",{unique:false})
            }
        })

    }
}

idb.open('nawa-db', 1, upgradeDB => {
    // Note: we don't use 'break' in this switch statement, the fall-through
    // behaviour is what we want.
    switch (upgradeDB.oldVersion) {
        case 1:
            upgradeDB.createObjectStore('stuff', {keyPath: ''});
    }
}).then(db => console.log("DB opened!", db));