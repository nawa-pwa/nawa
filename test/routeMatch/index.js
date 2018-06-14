import satarify from '@tencent/satarify';




fetch("https://nearby.qq.com/nearby-index/index-new.html?_wv=16777223&_wwv=4&_nav_txtclr=000000&_from=2&talent=1",{
    mode:"cors"
})


let precacheList = (function(){
    let maxTempalte = 10;

    for(var i=0;i<maxTempalte;i++){
        fetch(`https://11.url.cn/now/lib/smiley_${i}@2x.png?_bid=3232#test`,{
            mode:"cors"
        })
        .then(res=>{
            console.log('success');
            
        })
    }
})();



satarify.register('./sw.js');