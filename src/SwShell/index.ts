import {debug} from "../Lib";
import store from '../Store';

/// <reference path="../../typings/service-worker.d.ts" /> 

interface classInnerProp{
    skipWaiting:boolean; // default is true
    precache:Array<string>; // default is []
}

export default class SwShell{

    private precacheList:Array<string>;
    private skipWaitingFlag:boolean;
    private db;
    constructor(){
        this.precacheList = [];
        this.skipWaitingFlag = true;
        this.db = store.cache;

        self.addEventListener('install',this.installListener,false);
        self.addEventListener('activate',this.activateListener,false);

    }
    public set precache(list:Array<string>){
        if(list instanceof Array){
            this.precacheList = list;
        }
    }
    public set skipWaiting(flag:boolean){
        if(typeof flag === 'boolean') 
            this.skipWaitingFlag = flag;
    }
    
    private activateListener = (event:InstallEvent):void =>{
        debug("the new ServiceWorker has updated");
    }
    private installListener = (event:InstallEvent):void => {
        if(this.skipWaitingFlag){
            self.skipWaiting();
        }
        // iterate the Urls and 
        // this.precacheList.length && event.waitUntil(Promise.resolve(1))
        if(this.precacheList.length){
            // using fetchAndCache to update this files
            event.waitUntil(Promise.all(this.precacheList.map(url=>{
                return this.db.precacheUrl(url);
            })));
        }

    }
}