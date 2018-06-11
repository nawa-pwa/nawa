import satarify from '@tencent/satarify';
import idb from 'idb';

// satarify.register('./sw.js');


class LFU {
    constructor() {
        this.getDB = () => {
           return idb.open('NAWA-DB', 1, upgradeDB => {
                switch (upgradeDB.oldVersion) {
                    case 0:
                    case 1:
                    let store = upgradeDB.createObjectStore("LFU", {
                        keyPath: "url",
                    });
                    store.createIndex('usage', 'usage', {
                        unique: false
                    })
                        
                }
            })
        }
    }
    async add() {
        let db = await this.getDB();
        let tx = db.transaction('LFU', 'readwrite');

        let store = tx.objectStore('LFU');
        let url = "https://11.url.cn/now/lib/smiley_0@2x.png?_bid=3232"
        let record = await store.get(url);

        let url2 = "https://11.url.cn/now/lib/smiley_1@2x.png?_bid=3232"

        store.put({
            usage: Math.floor(Math.random() * 100),
            url:url2
        })


        return tx.complete;

    }
}

let lfu = new LFU();

lfu.add().then(res => {
    if (res) {
        debugger
    }
})