import {debug} from "../Lib";


/// <reference path="../../typings/service-worker.d.ts" /> 

interface classInnerProp{
    skipWaiting:boolean; // default is true
    precache:Array<string>; // default is []
}

export default class SwShell{

    private precacheList:Array<string>;
    private skipWaitingFlag:boolean;

    constructor(){

        this.precacheList = [];
        this.skipWaitingFlag = true;

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

    }
}