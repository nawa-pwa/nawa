/// <reference path="./index.d.ts" />


import Network from './Network';
import store from './Store';
import SwShell from './SwShell';
import defaultMiddle from './Lib/defaultMiddleware';
import CacheDB from './CacheDB';



export default class Nawa extends Network{

    private swShell;
    private defaultValues = {
        cache:{
            maxEntry:100,
            name:"NAWA-DB",
            query:{
                ignoreSearch:true
            }
        },
        debug:false,
        whitelist:null, // default it [host/pathtoname/sw.js]
        precache:[],
        filename:'sw.js',
        skipWaiting:true
    };

    
    constructor(param:NawaOptions){
        super();
        param = Object.assign({},this.defaultValues,param);

        store.debug = param.debug;
        store.filename = param.filename;
        store.whitelist = param.whitelist;
        store.cache = new CacheDB(param.cache);

        this.swShell = new SwShell();

        this.swShell.precache = param.precache;
        this.swShell.skipWaiting = param.skipWaiting;

        // add default middleware
        super.syncUse(defaultMiddle.middlewareWhitelist.bind(defaultMiddle));
        super.syncUse(defaultMiddle.isServiceWorker.bind(defaultMiddle));
        
    }

}

