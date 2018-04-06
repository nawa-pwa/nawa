'use strict';
import globalOptions from '../options';
import helpers from '../helpers';

/**
 * CacheFirst and update cache
 * @param {} request
 * @param {*} values
 * @param {*} options
 */
function cacheUpdate(request, values, options) {

    options = options || {};
    var cacheOptions = options.cache || globalOptions.cache;
    var cacheQueryOptions = cacheOptions.queryOptions;
    var successResponses = options.successResponses || globalOptions.successResponses;

    helpers.debug('Strategy: cache update [' + request.url + ']', options);
    return helpers
        .openCache(options)
        .then(function (cache) {
            return cache
                .match(request, cacheQueryOptions)
                .then(function (response) {
                    var now = Date.now();
                    if (response && successResponses.test(response.status)) {
                        // update
                        helpers.fetchAndCache(request, options);
                        return response
                    }

                    return helpers.fetchAndCache(request, options);
                });
        });
}

module.exports = cacheUpdate;