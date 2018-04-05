import Toolbox from './lib/sw-toolbox';
import {getDefaultWhiteList, stringToRegexp} from './lib/helpers';
import {addOptions} from './lib/decorator/pwalib';
import listeners from './lib/listeners';
import options from './lib/options';

export default class PWALib {
    static create(opts={}){
        let {config,stragety} = opts;

        let pwa = new PWALib(config);

    }
    constructor(param) {

        this._param = Object.assign({
            timeout: 3,
            debug: false,
            forceUpdate: true,
            whiteList: getDefaultWhiteList(self.location.origin,self.location.pathname),
            captureSW: false,
            cache:{},
            preCacheItems:[],
        }, param);


        options.debug = this._param.debug;
        options.timeout = this._param.timeout;
        options.setWhiteList = this._param.whiteList;
        options.forceUpdate = this._param.forceUpdate;
        options.captureSW = this._param.captureSW;
        options.setCache = this._param.cache;
        options.preCacheItems = this._param.preCacheItems;


        // Set up listeners.
        self.addEventListener('install', listeners.installListener);
        self.addEventListener('activate', listeners.activateListener);
        self.addEventListener('fetch', listeners.fetchListener);

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
    cacheFirst(path, options) {
        Toolbox
            .router
            .get(path, Toolbox.cacheFirst, options);
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
    cacheFirstUpdate(path, options) {
        Toolbox
            .router
            .get(path, Toolbox.cacheUpdate, options);
    }
    @addOptions
    cacheOnly(path, options) {
        Toolbox
            .router
            .get(path, Toolbox.cacheOnly, options);
    }

    precache(urls) {
        Toolbox.precache(urls);
    }
    get router() {
        return Toolbox.router;
    }

}