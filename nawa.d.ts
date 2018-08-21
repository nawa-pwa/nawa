
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
    interface routerOptions {
        maxAge?:number; // unit is second
        query?: {
            ignoreSearch: boolean
        }
    }
    type RequestHandler = (request:Request)=> Promise<Response>;
    
    interface Nawa{     
        cacheFirst(urlToMatch:RegExp,options?:routerOptions) : void;
        networkFirst(urlToMatch:RegExp,options?:routerOptions) : void;
        cacheUpdate(urlToMatch:RegExp,options?:routerOptions) : void;
        get(routePath: RegExp, handler: RequestHandler) : void;
        post(routePath: RegExp, handler: RequestHandler) : void;
        put(routePath: RegExp, handler: RequestHandler) : void;
        delete(routePath: RegExp, handler: RequestHandler) : void;
    
        revoke():void; // when meet error, remove all listeners
        use(middleware : asyncMiddleware) : void;
        syncUse(middleware : syncMiddleware) : void;
    }
    interface nawaMitt{
        new(param:NawaOptions):Nawa;
    }
    
}

export default Nawa