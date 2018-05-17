import Router from './Router/index';
import CacheDB from '../CacheDB';

interface globalOptions {
    maxEntry?: number;
    query?: {
        ignoreSearch: boolean
    }

}

class Network extends Router{
    constructor(param){
        super()

    }
}