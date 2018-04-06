export default {
    config:{
        "cache": {
            "name": "now-content",
            "maxAgeSeconds": 172800,
            "maxEntries": 150,
            "queryOptions": {
                "ignoreSearch": true
            }
        }
    },
    "stragety":{
        "cacheFirst":[{
            "origin":"11.url.cn",
            "path":[
                /now\/lib\/.*\.(?:js|css).*/,
                /now\/qq\/.*\.(?:js|css|png|jpeg|jpg|webp).*/
            ]
        },{
            origin:"open.mobile.qq.com",
            path:/sdk\/.*\.(?:js).*/
        }],
        cacheFirstUpdate:[
            {
                origin:"now.qq.com",
                path:/.*\.(?:html).*/
            }
        ]
    }
}


/**
 * @param {Object} stragety:
 *      key: stragety,
 *      value: Array || Object
 *    @key {cacheFirst || cacheFirstUpdate || cacheOnly}
 *    @value {Array}
 *          @Object 
 *  
 */