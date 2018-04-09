import compose from './pureCompose';


class MiddlewareControl{
    constructor(){
        this.middleware = [];
    }
    add(fn){
        this.middleware.push(fn);
    }
    execute(context,fn=()=>{}){
        return compose(this.middleware)(context,fn);
    }
}

export default new MiddlewareControl;