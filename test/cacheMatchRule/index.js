class CacheDBTest{
    constructor(){
        this.DBName = "TEST-CacheDB";
        this.matchUrl = {
            ignoreSearch:"https://11.url.cn/now/lib/smiley_1@2x.png?_bid=3232#test",
            withHash:"https://11.url.cn/now/lib/smiley_1@2x.png#test",
        }
    }
    open(){
        return caches.open(this.DBName);
    }
    async addRecord(){
        let cache = await this.open();

        let req = new Request("https://11.url.cn/now/lib/smiley_1@2x.png",{mode:"cors"});

        cache.add(req);
    }
    async match(){
        let cache = await this.open();

        let res_no_search = await cache.match(this.matchUrl.ignoreSearch,{
            ignoreSearch:true
        });

        let res_with_hash = await cache.match(this.matchUrl.withHash,{
            ignoreSearch:true
        })

        if(res_no_search){
            console.log("res_no_search",res_no_search);
        }

        if(res_with_hash){
            console.log("res_with_hash",res_with_hash)
        }


    }

}

let cacheDB = new CacheDBTest();

cacheDB.addRecord()
.then(()=>{
    cacheDB.match()
})