/**
 * check the route MatchRule
 */

import Router from '../../src/Network/Router';

export default function (){
    let route = new Router();

    const testData = [
        {url:"https://11.url.cn/now/lib/smiley_6@2x.png?_bid=3232",method:"get"},
        {url:"http://localhost:8080/routeMatch/index.html",method:"get"},
    ];

    route.get(/11.url.cn\/now\/lib\/.*.js/,(req)=>{
        return Promise.resolve(new Response());
    });
    // http://localhost:8080/routeMatch/index.html
    route.get(/localhost\:8080\/routeMatch\/.*.html/,req=>{
        return Promise.resolve(new Response());
    })

    let matches = [];
    for(let data of testData){
        let handler = route.match(data);
        matches.push(handler);
    }


}





