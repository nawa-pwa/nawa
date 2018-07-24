interface NawaOptions {
    cache?: globalOptions;
    debug?: boolean;
    whitelist?:Array<string|RegExp>;
    precache?:Array<string>;
    filename?:string;
    skipWaiting?:boolean;
}


interface NawaContructor{
    new (param: NawaOptions):Nawa;
}
interface Nawa{
    constructor:NawaContructor;
    cacheFirst(param : routerOptions) : void;
    networkFirst(param : routerOptions) : void;
    cacheUpdate(param : routerOptions) : void;
    get(param : routerOriginOpt) : void;
    post(param : routerOriginOpt) : void;
    put(param : routerOriginOpt) : void;
    delete(param : routerOriginOpt) : void;

    revoke():void; // when meet error, remove all listeners
    use(middleware : asyncMiddleware) : void;
    syncUse(middleware : syncMiddleware) : void;
}

export default Nawa;