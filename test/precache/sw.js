import Nawa from '../../src';
import LFU from '../../src/CacheDB/LFU';

let precacheList = (function(){
    let arr = [];
    let maxTempalte = 104;

    for(var i=0;i<maxTempalte;i++){
        arr.push(`https://11.url.cn/now/lib/smiley_${i}@2x.png?_bid=3232#test`)
    }
    return arr;
})();

precacheList = ["http://11.url.cn/now/lib/15.1.0/react-with-addons.min.js?_bid=3123"]

let app = new Nawa({
    skipWaiting:true,
    debug:true,
    precache:precacheList
});

/**
 * when you test the precache, you will meet the problem. 
 * If you send many requests in one Promise.all, the amount of indexDB is:
 *  x_amount = x0 + x_n - x_r
 *  (
 *      x0: current amount of indexDB, 
 *      x_n: the amount of new requests
 *      x_r: indexDB 里面需要删除的数量。
 *  )
 * 如果你针对的是每一次请求的话，则结果为：
 *  x_amount = x0 + 1 - x_r
 */