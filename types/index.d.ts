interface globalOptions {
    DBName?: string,
    maxEntry?: number;
    query?: {
        ignoreSearch: boolean
    }
}

declare interface routerOptions {
    path: string;
    origin: string | RegExp;
    cacheDB?: string;
    maxEntry?: number;
    query?: {
        ignoreSearch: boolean
    }

}


