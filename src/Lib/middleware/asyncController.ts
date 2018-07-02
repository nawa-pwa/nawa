import compose from './lib/promiseCompose';

class AsyncMiddlewareControl{

    private middleware = [];

    constructor(){

        // we need to add a middleware at first,
        // ensure that the middleware finally return Response
        this.wrap();

    }
    private wrap(){

        this.add(async (ctx,next)=>{
            await next();
            return ctx.response;
        })
    }
    add(fn){
        this.middleware.push(fn);
    }
    execute(context,fn){
        return compose(this.middleware)(context,fn.bind(null,context));
    }
}

export default new AsyncMiddlewareControl;