const path = require('path');
const Uglifyjs = require('uglifyjs-webpack-plugin');


const COMPILE = (process.env.NODE_ENV === 'compile');

let config = {
    devtool: 'cheap-module-source-map',
    entry: {
        'webpwa': path.join(__dirname,'./src/index'),
        'sw':path.join(__dirname,'./example/index')
    },
    output: {
        path: path.join(__dirname, 'dist'),
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
