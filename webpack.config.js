const path = require('path');
const Uglifyjs = require('uglifyjs-webpack-plugin');


const COMPILE = (process.env.NODE_ENV === 'compile');

let config = {
    devtool: 'cheap-module-eval-source-map',
    entry: {
        'nawa': path.join(__dirname,'./src/index'),
        'index':path.join(__dirname,'./example/index'),
        'shangfen':path.join(__dirname,'./example/shangfen'),
    },
    output: {
        path: path.join(__dirname, 'dev'),
        filename: '[name].js',
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            use: [{
                loader: 'babel-loader',
                query: {
                    presets: ['es2015'],
                    "plugins": [
                        ["transform-decorators-legacy"],
                      ]
                }
            }]
        }]
    },
    plugins:[
        new Uglifyjs({
            uglifyOptions: {
                compress: {
                    pure_funcs: ['console.log']
                },
                warnings: false
            }

        }),
    ]

}


module.exports = config;
