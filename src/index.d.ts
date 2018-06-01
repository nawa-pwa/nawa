/// <reference path="./Network/index.d.ts" /> 

interface NawaOptions {
    cache?: globalOptions;
    debug?: boolean;
    whitelist?:Array<string>;
    precache?:Array<string>;
    filename?:string;
    skipWaiting?:boolean;
}

declare class Network {
    private routes : object;
    private swShell;

    public get() : void;
    public cacheFirst(param : routerOptions) : void;
    public networkFirst(param : routerOptions) : void;
    public cacheUpdate(param : routerOptions) : void;
    public get(param : routerOriginOpt) : void;
    public post(param : routerOriginOpt) : void;
    public put(param : routerOriginOpt) : void;
    public delete(param : routerOriginOpt) : void;

    public use(middleware : asyncMiddleware) : void;
    public syncUse(middleware : syncMiddleware) : void;
}

declare class Nawa extends Network {
    constructor(param : NawaOptions);
}

