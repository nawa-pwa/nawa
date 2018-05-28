const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')


let config = {
    devtool: 'cheap-module-eval-source-map',
    mode:"development",
    entry: {
        'middleware/index':path.join(__dirname,'test/middleware/index'),
        'middleware/sw':path.join(__dirname,'test/middleware/sw'),
        "precache/index":path.join(__dirname,'test/precache/index'),
        "precache/sw":path.join(__dirname,'test/precache/sw'),
    },
    output: {
        path: path.join(__dirname, 'dev'),
        filename: '[name].js',
    },
    resolve:{
        extensions:[".ts",".js"],
        modules:[path.resolve(__dirname, "src"), "node_modules"]
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
            filename: 'middleware/index.html',
            inject:true,
            chunks:[
                "middleware/index"
            ]
          }),
          new HtmlWebpackPlugin({
            title: 'precache',
            template: 'test/precache/index.html',
            filename: 'precache/index.html',
            inject:true,
            chunks:[
                "precache/index"
            ]
          })
    ]

}


module.exports = config;
