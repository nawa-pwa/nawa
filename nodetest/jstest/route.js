class Route{
    constructor(){
        this.routes = new Map();
    }
    match(request){
        let url = request.url;

        if(this.pureHost){
            let matchUrl = new URL(url);
            url = matchUrl.origin + matchUrl.pathname;
        }

        let route = this.matchMethod(request.method,url) || this.matchMethod('any',url);

        return route;
    }
    matchMethod(method,url){
        let methodMap = this.routes.get(method);

        if(!methodMap) return null;
        
        return this.matchRoute(methodMap,url);
    }
    matchRoute(routesMap,url){
        let routesIterator = routesMap.entries();
        let item = routesIterator.next();

        while(!item.done){
            let pattern = item.value[0];

            if(pattern.test(url)){
                return item.value[1]
            }
            item = routesIterator.next();
        }

        return null;
    }

     get(routePath, handler){
        this.add('get',routePath,handler);
    }
     post(routePath, handler){
        this.add('post',routePath,handler);
    }
     put(routePath, handler){
        this.add('put',routePath,handler);
    }
     delete(routePath, handler){
        this.add('delete',routePath,handler);
    }
     any(routePath, handler){
        this.add('any',routePath,handler);
    }   

     add(method,hrefReg, handler,options){
        let route = handler;

        !this.routes.has(method) && this.routes.set(method,new Map());
        let routeMap = this.routes.get(method);
        routeMap.set(hrefReg,route);

    }

}

module.exports = function(){
    let route = new Route();

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
        handler && matches.push(handler);
    }

}

