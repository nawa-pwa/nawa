import satarify from '@tencent/satarify';
import idb from 'idb';
import "./subTest/iteraOrder";

// satarify.register('./sw.js');


class LFU {
    constructor() {
        this.maxCount = 100;
        this.StoreName = "LFU";
        this.deletePercent = 0.4;
        this.DBIndexUsage = 'usage';

        this.count()
        .then(len=>{
            console.log(len);
        })
    }
    getDB() {
        return idb.open('TEST-LFU', 1, upgradeDB => {
            
            switch (upgradeDB.oldVersion) {
                case 0:
                case 1:
                    let storeA = upgradeDB.createObjectStore(this.StoreName, {
                        keyPath: "url",
                    });
                    storeA.createIndex('usage', 'usage', {
                        unique: false
                    })
                    storeA.createIndex('date', 'date', {
                        unique: false
                    });
                    break;

            }
        });
    }
    isFull() {
        return this.count()
            .then(len => {
                console.log("the length is ",len);
                return len > this.maxCount;
            })
    }
    async LFUdelete(){
        let db = await this.getDB();
        let tx = db.transaction(this.StoreName,"readwrite");
        let store = tx.objectStore(this.StoreName);

        let length = await store.count();
        let needToRemove =Math.max(length,this.maxCount) - this.maxCount + Math.floor(length * this.deletePercent);
        let urls = [];
        console.log("the length is, another, ",length);
        
        length > this.maxCount && store.index(this.DBIndexUsage)
        .openCursor().then(function cursorIter(cursor){
            if(cursor){
                let url = cursor.value.url;
                urls.push(url);  
                console.log(urls);                            
                cursor.delete();

                if(urls.length < needToRemove){
                    cursor.continue().then(cursorIter)
                }
            }
        });

        return tx.complete.then(()=>urls);


    }
    async count() {
        let db = await this.getDB();
        let tx = db.transaction(this.StoreName, "readonly")
        let store = tx.objectStore(this.StoreName);
        return store.count();
    }
    async idbGet(url) {
        let db = await this.getDB();

        return db.transaction(this.StoreName)
            .objectStore(this.StoreName).get(url);
    }
    async idbAdd({
        url,
        usage,
        date
    }) {
        let db = await this.getDB();
        let tx = db.transaction(this.StoreName, 'readwrite');
        let store = tx.objectStore(this.StoreName);

        return store.put({
            url,
            usage,
            date
        })

    }
    async add(url) {
        let data = await this.idbGet(url);
        let list = [];
        if (data) {
            data.usage++;
        } else {
            let cond = await this.isFull();

            if (cond) {
                list = await this.LFUdelete();
            }
            data = {
                url,
                usage: 1,
                date: Date.now()
            }
        }
        return this.idbAdd(data).then(() => list);

    }
}

let lfu = new LFU();

let precacheList = (function () {
    let arr = [];
    let maxTempalte = 104;

    for (var i = 0; i < maxTempalte; i++) {
        arr.push(`https://11.url.cn/now/lib/smigy${i}@2x.png?12bid=332`)
    }
    return arr;
})();


Promise.all[precacheList.map(async (url)=>{
    
    await lfu.add(url);
    let len =  await lfu.count();
    console.log("after add, then, the length is, ",len);

    return len;
})];
