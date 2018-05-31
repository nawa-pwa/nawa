/// <reference path="./index.d.ts" />


import Network from './Network';
import store from './Store';
import SwShell from './SwShell';
import defaultMiddle from './Lib/defaultMiddleware';
import CacheDB from './CacheDB';



class Nawa extends Network{

    private swShell;

    constructor(param:NawaOptions){
        super(param.cache);
        store.debug = param.debug;
        store.filename = param.filename;
        store.whitelist = param.whitelist;
        store.cache = new CacheDB(param.cache);


        this.swShell = new SwShell();

        this.swShell.precache = param.precache;
        this.swShell.skipWaiting = param.skipWaiting;

        // add default middleware
        super.syncUse(defaultMiddle.middlewareWhitelist);
        super.syncUse(defaultMiddle.isServiceWorker);
        
    }

}

