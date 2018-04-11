import Toolbox from './lib/sw-toolbox';
import router from './lib/router';
import {
    networkOnly,
    networkFirst,
    cacheOnly,
    cacheFirst,
    fastest,
    cacheUpdate
} from './lib/strategies';
import {getDefaultWhiteList, precache, stringToRegexp, checkReq} from './lib/helpers';
import {addOptions} from './lib/decorator/pwalib';
import listeners from './lib/listeners';
import options from './lib/options';
import middleware from './lib/middleware/mdControler';

export default class PWALib {
    static create(opts = {}) {
        let {config, stragety} = opts;

        let pwa = new PWALib(config);

        Object
            .keys(stragety)
            .forEach(key => {
                stragety[key].forEach(cacheObj => {

                    if (cacheObj.path instanceof Array) {
                        // set path
                        cacheObj
                            .path
                            .forEach(pathKey => {
                                pwa[key](cacheObj.pathKey, {origin: cacheObj.origin})
                            })
                    } else if (cacheObj.path instanceof RegExp) {
                        pwa[key](cacheObj.path, {origin: cacheObj.origin})
                    }

                })
            });
    }
    constructor(param) {

        this._param = Object.assign({
            timeout: 3,
            debug: false,
            forceUpdate: true,
            whiteList: getDefaultWhiteList(self.location.origin, self.location.pathname),
            captureSW: false,
            cache: {},
            preCacheItems: []
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

        // add default middleware add inWhiteList && isHTML
        middleware.add((req, next) => {
            // chech req and request

            if (checkReq(req)) {
                next();
            }
        })
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
        router.get(path, cacheFirst, options);
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
        router.get(path, cacheUpdate, options);
    }
    @addOptions
    cacheOnly(path, options) {
        router.get(path, cacheOnly, options);
    }

    precache(urls) {
        precache(urls);
    }
    get router() {
        return router;
    }
    /**
     * add middleware function
     * @param {Function} fn: function should be like this:
     * (request,next){
     *      //... doSth
     *      next();
     *      //.. doSth
     * }
     */
    use(fn) {
        middleware.add(fn);
    }

}