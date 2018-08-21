import satarify from '@tencent/satarify';


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


fetch("https://11.url.cn/now/lib/15.1.0/react-with-addons.min.js?_bid=3123",{
    mode:"cors"
});


satarify.register('./sw.js');