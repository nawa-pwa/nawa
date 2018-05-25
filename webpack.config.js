const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')


let config = {
    devtool: 'cheap-module-eval-source-map',
    entry: {
        'nawa_ts':path.join(__dirname,'./ts_src'),
        'index':path.join(__dirname,'./example/index'),
        'shangfen':path.join(__dirname,'./example/shangfen'),
    },
    output: {
        path: path.join(__dirname, 'dev'),
        filename: '[name].js',
    },
    resolve:{
        extensions:[".ts",".js"]
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
    },
    plugins:[
        new HtmlWebpackPlugin({
            title: 'middleware',
            template: 'test/middleware/index.html',
          }),
          new HtmlWebpackPlugin({
            title: 'precache',
            template: 'test/precache/index.html',
          })
    ]

}


module.exports = config;
