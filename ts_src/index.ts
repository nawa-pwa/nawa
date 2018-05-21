import Network,{globalOptions}  from './Network';
import Store from './Store';



interface NawaOptions{
    cache?:globalOptions;
    debug?:boolean;
}

class Nawa extends Network{
    constructor(param){
        super(param.cache);
        Store.debug = param.debug;

        

    } 
}

