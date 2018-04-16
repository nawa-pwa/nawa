import idb from 'idb';

/**
 * the indexedDB structure:
 *
 * {
    id[PrimaryKey], // primaryKey, and it will increase itself by step 1
    url[index],
    usage,
    date
    }
 * 
 */
class LFU{
    constructor(){
        this._OS = 'LFU';

        this.DB = idb.open('nawa', 1, upgradeDB => {
            switch (upgradeDB.oldVersion) {
                case 1:
                  let db = upgradeDB.createObjectStore(this._OS,{ keyPath:"id",autoIncrement:true});
                    db.createIndex('url','url',{unique:true})
              }
          })
          .catch(err=>{
              console.error(err);
              throw err;
          })

    }
    getCounts(){
        return this.DB.then(db=>{
            const tx = db.transaction(this._OS);
            tx.objectStore(this._OS).count();
            return tx.complete;
        })
    }
    /**
     * remove data which is after the specific id, include the id
     * @param {Number} id 
     * @return {Array} urls: resolve the keys which have been deleted from indexedDB
     */
    removeUrls(id){
        return this.DB.then(db=>{
            const tx = db.transaction(this._OS);
            const LFU_OS = tx.objectStore(this._OS);
            let urls = [];

            let range = IDBKeyRange.upperBound(id);
            LFU_OS.openCursor(range).then(function iteratorKey(curosr){
                    if(!cursor) return;

                    urls.push(curosr.value.url);

                    cursor.delete(curosr.value.id);

                    curosr.continue().then(iteratorKey);
            });

            return tx.complete.then(()=>urls);

        })
    }
    getUrl(url){
        return this.DB.then(db=>{
            const tx = db.transaction(this._OS);
            const LFU_OS = tx.objectStore(this._OS);

            return LFU_OS.get(url);
        })
    }
    /**
     * 
     * @param {String} url 
     * @param {Number} date timestamps
     */
    save(url,date){
        return this.DB.then(db=>{
            const tx = db.transaction(this._OS);

            const LFU_OS = tx.objectStore(this._OS);

            LFU_OS.add({
                url,date,usage:1
            })

            return tx.complete;
        })
    }
    /**
     * Update url and its usage
     * @param {String} url 
     */
    update(url){
        return this.DB.then(db=>{
            const tx = db.transaction(this._OS);

            const LFU_OS = tx.objectStore(this._OS);

            // get usage 
            // update usage + 1

            LFU_OS.get(url).then(data=>{
                data.usage++;
                LFU_OS.put(data);
            })
            
            return tx.complete;

        })
    }
}

