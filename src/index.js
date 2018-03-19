import Toolbox from './lib/sw-toolbox';
import { getDefaultWhiteList,stringToRegexp } from './lib/helpers';
import { addOptions } from './lib/decorator/pwalib';


export default class PWALib{
    constructor(param){
        this._param = Object.assign({
            timeout:3,
            debug:false,
            forceUpdate: true,
            HTMLMatch: getDefaultWhiteList(self.location.origin,self.location.pathname),
            maxEntries:100,
            options:{},
            captureSW:false,
        },param);

        this._contentLib = "now-content";

        Toolbox.options.debug = this._param.debug;
        Toolbox.options.networkTimeoutSeconds = this._param.timeout;
        Toolbox.options.whiteList = stringToRegexp(this._param.HTMLMatch);
        Toolbox.options.forceUpdate = this._param.forceUpdate;
        Toolbox.options.captureSW = this._param.captureSW;


    }
    /**
     * @desc using decorator to add the default options param.
     *      if there is cache, then using cache. otherwise, get and update.
     *      feature:
     *          1. always keep the cache fresh. when get the cache, 
     *              check the `date` header whether the difftime range is in maxAgeSeconds property
     * 
     */
    @addOptions
    cacheFirst(path,options){
        Toolbox.router.get(path,Toolbox.cacheFirst,options);
    }

    /**
     * @desc the common features are similar to the above. 
     *       the more process is when the cache is successfully return and update.
     *       likely, it's often  used to cache HTML 
     * 
     * @param {regexp || string} path : get the Path route
     * @param {*} options 
     */
    @addOptions
    cacheFirstUpdate(path,options){
        Toolbox.router.get(path,Toolbox.cacheUpdate,options);
    }
    @addOptions
    cacheOnly(path,options){
        Toolbox.router.get(path,Toolbox.cacheOnly,options);
    }


    precache(urls){
        Toolbox.precache(urls);
    }
    get router(){
        return Toolbox.router;
    }


}