interface globalStore{
    debug?:boolean;
    whitelist?:Array<RegExp>; // defaultly, it is the same path relative to sw.js
    filename?:RegExp;
    cache:CacheDB | any
}


class StoreState{
    private debugSetting=false
    private whitelistReq:Array<RegExp>;
    private SWfilename:RegExp = /\/sw\.js/i;
    public cache:CacheDB | any;
    constructor(){
        this.whitelistReq = this.getDefaultWhiteList();
    }

    public set filename(file:any){
        // when receive undefined value, then reset it.
        if(!file){
            file = 'sw.js';
        }
        // it could accept string or RegExp type
        if(!(file instanceof RegExp)){
            file = new RegExp(this.regexEscape(file),'i')
          }
          this.SWfilename = file;
    }
    public get filename():any{
        return this.SWfilename;
    }


    public set debug(value:boolean){
        if(typeof value === 'boolean'){
            this.debugSetting = value;
        }
    }
    public get debug(){
        return this.debugSetting;
    }

    public get whitelist(){
        return this.whitelistReq;
    }
    public set whitelist(list:Array<any>){
        // list could contain string or regexp

        if(list instanceof Array){
            this.whitelistReq = this.stringToRegexp(list);
          }else{
            console.warn('whiteList should be Array, and default is ' + this.getDefaultWhiteList());
          }
    }

    /**
     * @desc  get the default whiteList
     *        like: if the sw.js location is "https://now.qq.com/sw.js"
     *        then, it will return [/https:\/\/now.qq.com\/index.html/]
     * 
     */
    private getDefaultWhiteList(): Array<RegExp> {
        let origin = self.location.origin,
            pathname = self.location.pathname;

        let pathArray = pathname.split('/');

        pathArray[pathArray.length - 1] = 'index.html';

        let reg = new RegExp(origin + pathArray.join('/'));

        return [reg];

    }
    private stringToRegexp(lists):Array<RegExp> {
        return lists.map(list => {
            if (!(list instanceof RegExp)) {
                list = new RegExp(this.regexEscape(list), 'i');
            }
            return list;

        })
    }
    private regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
}

export default new StoreState;