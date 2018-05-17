import compose from './lib/pureCompose';


class MiddlewareControl{

    private middleware = [];

    add(fn){
        this.middleware.push(fn);
    }
    execute(context,fn=()=>{}){
        return compose(this.middleware)(context,fn.bind(null,context));
    }
}

export default new MiddlewareControl;