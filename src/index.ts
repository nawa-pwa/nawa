/// <reference path="./index.d.ts" />


import Network from './Network';
import Store from './Store';



class Nawa extends Network{
    constructor(param:NawaOptions){
        super(param.cache);
        Store.debug = param.debug;
        
    } 
}

