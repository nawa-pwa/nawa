
declare interface globalOptions {
    name?: string, // DB name
    maxEntry?: number;
    query?: {
        ignoreSearch: boolean
    }
}

declare interface routerOptions {
    maxAge?:number; // unit is second
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
    };
    maxAge?:number; // unit is second
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

type RequestHandler = (request:Request)=> Promise<Response>;

type MethodDes = "get" | "post" | "any" | "put" | "delete";

<<<<<<< HEAD
interface RouteMap{
    
}

declare class Route{
    public makeHandler:(url)=>Function;
}
=======
interface routeMap{

}
>>>>>>> 9a4d23f2265bfa59334774a944af14a68626398c
