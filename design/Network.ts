/**
 * 异步中间件
 */
interface AsyncMiddleWare {
    (ctx : Object, next : Function) : Promise < Response >;
}

interface SyncMiddleWare {
    (ctx : Object, next : Function) : undefined;
}

interface NetworkGlobal {
    path : RegExp | string;
    origin : string;
    stragety : Stragety;
}

interface Network {
    get(Param: RouterAddParam);
    post(Param: RouterAddParam);
    put(Param: RouterAddParam);
    delete(Param: RouterAddParam);
    any(Param: RouterAddParam);
    add(Param: RouterAddParam);

    // middleware
    use(middleware : AsyncMiddleWare); // add middleware in fetch Listener,
    // the last outside middleware should return ctx.response
    syncUse(middleware : SyncMiddleWare);
}

/**
 * Default, It will start LFU
 */
interface globalOptions {
    cacheDB : string;
    maxEntry?: number;
    query?: {
        ignoreSearch: boolean
    }

}

/**
 * in order to reuse the stragety
 */
interface Stragety {
    new(globalOptions?: globalOptions)
    main(request : Request) : Promise < Response >
}

/**
 * Router Map 结构为：
 * origin =>
 *      method=>
 *          pathName.source=>
 *              Route
 *
 */

interface RouterAddParam {
    method?: string,
    path : RegExp | string,
    origin : string,
    handler : Stragety,
}

// path:RegExp | string,origin: string, handler:Stragety
interface Router {
    routes: Map<string,object>;
    get?: any;
    post?: any;
    put?: any;
    delete?: any;
    any?: any;
    add(Param: RouterAddParam):any;
    matchMethod(method : string, url : string);
    match(request: Request):Function; // 综合全部的中间件，返回一个整体的 Function
}

interface Route {
    new(method : string, path : RegExp | string, handler, options);
    makeHandler(url : string) : Function // 返回具体可执行的函数
}