/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 *
 * @param {Array} middleware
 * @return {Function}
 * @api public
 */

export default function compose(middleware) {
    if (!Array.isArray(middleware)) 
        throw new TypeError('Middleware stack must be an array!')
    for (const fn of middleware) {
        if (typeof fn !== 'function') 
            throw new TypeError('Middleware must be composed of functions!')
    }

    /**
     * @param {Object} context
     * @return {Promise}
     * @api public
     */

    return function (context, next) {
        // 记录上一次执行中间件的位置 #
        let index = -1
        return dispatch(0)
        function dispatch(i) {
            // 理论上 i 会大于 index，因为每次执行一次都会把 i递增， 如果相等或者小于，则说明next()执行了多次
            if (i <= index) 
                return new Error('next() called multiple times')
                
            index = i
            // 取到当前的中间件
            let fn = middleware[i]
            if (i === middleware.length) {
                // get last fn
                fn = next
            }
            if (!fn) 
                return;
            
            return fn(context, function next() {
                return dispatch(i + 1)
            })

        }
    }
}