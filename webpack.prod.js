const path = require('path');
const Uglifyjs = require('uglifyjs-webpack-plugin');


const COMPILE = (process.env.NODE_ENV === 'compile');

let config = {
    devtool: 'hidden-source-map',
    entry: {
        'nawa': path.join(__dirname,'./src/index'),
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].min.js',
        libraryTarget:"umd",
        library:"nawa",
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