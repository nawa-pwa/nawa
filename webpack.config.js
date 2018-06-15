const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const striPlugin = require("webpack-subresource-integrity");
const webpack = require('webpack');
const glob = require("glob");



let config = {
    devtool: 'cheap-module-eval-source-map',
    mode:"development",
    entry: {
        'middleware/index': path.join(__dirname, 'test/middleware/index'),
        'middleware/sw': path.join(__dirname, 'test/middleware/sw'),
        "precache/index": path.join(__dirname, 'test/precache/index'),
        "precache/sw": path.join(__dirname, 'test/precache/sw'),
        "idbTest/index": path.join(__dirname, 'test/idbTest/index'),
        "cacheMatchRule/index": path.join(__dirname, 'test/cacheMatchRule/index'),
        "routeMatch/index": path.join(__dirname, 'test/routeMatch/index'),
        "routeMatch/sw": path.join(__dirname, 'test/routeMatch/sw'),
        "whitelist/sw": path.join(__dirname, 'test/whitelist/sw'),
        "whitelist/index": path.join(__dirname, 'test/whitelist/index'),
        "whitelist/precache/index": path.join(__dirname, 'test/whitelist/precache/index'),
    },
    output: {
        path: path.join(__dirname, 'dev'),
        filename: '[name].js',
        // crossorigin: 'anonymous'
    },
    resolve: {
        extensions: [".ts", ".js"],
        modules: [path.resolve(__dirname, "src"), "node_modules"]
    },
    devServer: {
        contentBase:"./dev",
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
        }, {
            test: /\.ts$/,
            use: "ts-loader",
            exclude: /node_modules/
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'middleware',
            template: 'test/middleware/index.html',
            filename: 'middleware/index.html',
            inject: true,
            chunks: [
                "middleware/index"
            ]
        }),
        new HtmlWebpackPlugin({
            title: 'precache',
            template: 'test/precache/index.html',
            filename: 'precache/index.html',
            inject: true,
            chunks: [
                "precache/index"
            ]
        }),
        new HtmlWebpackPlugin({
            title: 'idbTest',
            template: 'test/idbTest/index.html',
            filename: 'idbTest/index.html',
            inject: true,
            chunks: [
                "idbTest/index"
            ]
        }),
        new HtmlWebpackPlugin({
            title: 'cacheMatchRule',
            template: 'test/cacheMatchRule/index.html',
            filename: 'cacheMatchRule/index.html',
            inject: true,
            chunks: [
                "cacheMatchRule/index"
            ]
        }),
        new HtmlWebpackPlugin({
            title: 'routeMatch',
            template: 'test/routeMatch/index.html',
            filename: 'routeMatch/index.html',
            inject: true,
            chunks: [
                "routeMatch/index"
            ]
        }),
        new HtmlWebpackExternalsPlugin({
            externals: [{
                module: 'react',
                entry: '//11.url.cn/now/lib/15.1.0/react-with-addons.min.js?_bid=3123',
                global: 'React'
            },
            {
                module: 'react-dom',
                entry: '//11.url.cn/now/lib/15.1.0/react-dom.min.js?_bid=3123',
                global: 'ReactDOM'
            }]
        }),
        new CleanWebpackPlugin(['dev']),
        new striPlugin({ // 添加 crossorigin 头
            hashFuncNames: ['sha256', 'sha384']
        }),
    ]

}


module.exports = config;