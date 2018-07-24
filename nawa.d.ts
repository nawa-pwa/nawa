
declare var Nawa:nawa.nawaMitt;

declare namespace nawa{
    interface NawaOptions {
        cache?: globalOptions;
        debug?: boolean;
        whitelist?:Array<string|RegExp>;
        precache?:Array<string>;
        filename?:string;
        skipWaiting?:boolean;
    }
    
    interface Nawa{      
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
    interface nawaMitt{
        new(param:NawaOptions):Nawa;
    }
    
}

export default Nawa