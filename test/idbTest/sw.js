import Nawa from '../../src';

let precacheList = (function(){
    let arr = [];
    let maxTempalte = 104;

    for(var i=0;i<maxTempalte;i++){
        arr.push(`https://11.url.cn/now/lib/smiley_${i}@2x.png?_bid=3232`)
    }
    return arr;
})()

let app = new Nawa({
    skipWaiting:true,
    debug:true,
    precache:precacheList
});


