
declare interface globalOptions {
    name?: string, // DB name
    maxEntry?: number;
    query?: {
        ignoreSearch: boolean
    }
}

declare interface routerOptions {
    path: string | RegExp;
    origin: string | RegExp;
    query?: {
        ignoreSearch: boolean
    }
}

interface stragetyOptions {
    origin: string | RegExp;
    query?: {
        ignoreSearch: boolean
    }
}


interface routerOriginOpt{
    path: string | RegExp;
    origin: string | RegExp;
    handler: (request:Request)=>Promise<Response>;
    query?: {
        ignoreSearch: boolean
    }
}

interface middlewareObj{
    request:Request;
    response:Response
}

interface syncMiddleware{
    (ctx:middlewareObj,next:Function): void;
}

interface asyncMiddleware{
    (ctx:middlewareObj): Promise<any>;
}