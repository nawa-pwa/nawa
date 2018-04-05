import options from '../options';

export const addOptions = function(target,name,desc){
    const method = desc.value;
    desc.value = (...args)=>{
        
        let cache = Object.assign({},options._cache);

        if(typeof args[1] === "object"){
            args[1].cache = Object.assign(cache,args[1].cache);
        }else{
            args[1] = options;
        }

        return method.apply(target, args);
    }
    return desc;
}