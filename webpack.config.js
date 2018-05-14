const path = require('path');


let config = {
    devtool: 'cheap-module-eval-source-map',
    entry: {
        'nawa': path.join(__dirname,'./src/index'),
        'nawa_ts':path.join(__dirname,'./ts_src'),
        'index':path.join(__dirname,'./example/index'),
        'shangfen':path.join(__dirname,'./example/shangfen'),
    },
    output: {
        path: path.join(__dirname, 'dev'),
        filename: '[name].js',
    },
    resolve:{
        extensions:["ts","js"]
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            use: [{
                loader: 'babel-loader',
                query: {
                    presets: ['es2015'],
                    "plugins": [
                        ["transform-decorators-legacy"]
                      ]
                }
            }]
        },{
            test: /\.ts$/,
            use:"ts-loader",
            exclude:/node_modules/
        }]
    }

}


module.exports = config;
