import idb from 'idb';

class IteratorOrder {
    constructor() {
        this.StoreName = "LFU";
        this.deletePercent = 0.2;
        this.DBIndexUsage = 'usage';
    }
    getDB() {
        return idb.open('IteratorTest', 1, upgradeDB => {

            switch (upgradeDB.oldVersion) {
                case 0:
                case 1:
                    let storeA = upgradeDB.createObjectStore(this.StoreName, {keyPath: "url"});
                    storeA.createIndex('usage', 'usage', {unique: false});
                    break;
            }
        });
    }
    async idbAdd({url, usage}) {
        let db = await this.getDB();
        let tx = db.transaction(this.StoreName, 'readwrite');
        let store = tx.objectStore(this.StoreName);

        return store.put({url, usage})

    }
    async iteratorData() {
        let db = await this.getDB();
        let tx = db.transaction(this.StoreName, "readwrite");
        let store = tx.objectStore(this.StoreName);

        store
            .index(this.DBIndexUsage)
            .openCursor()
            .then(function cursorIter(cursor) {
                if (cursor) {
                    // console.log(cursor.value.usage);
                    cursor
                        .continue()
                        .then(cursorIter);
                }
            })
    }
    async createRandomTable(data) {
        await Promise.all(data.map(val => {
            return this.idbAdd(val);
        }));

        this.iteratorData();
    }
}

let iteratorIDB = new IteratorOrder();

// create random record

let data = [];
for (var i = 0; i < 30; i++) {
    data.push({
        url: `https://11.url.cn/now/lib/smigy_@2x.png${i}?9bid=332`,
        usage: Math.floor(Math.random() * 100)
    })
}

iteratorIDB.createRandomTable(data);