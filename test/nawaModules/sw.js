import Nawa from '@tencent/nawa';




let app = new Nawa({
    skipWaiting:true,
    debug:true,
    whitelist:[/whitelist\/index\.html/],
    cache:{
        name:"nawaModules"
    }
});

app.cacheUpdate({
    path:/whitelist\/index\.html/,
    origin:"localhost:8080"
});

