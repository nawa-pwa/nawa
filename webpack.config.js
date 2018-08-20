const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const striPlugin = require("webpack-subresource-integrity");
const webpack = require('webpack');
const {produceHtmls,
    produceEntries,
    produceHtmlPlugins,} = require("./webpack/utils");

const TestDir = path.join(__dirname,'test');

let htmlDirs = produceHtmls(TestDir);

let entries = produceEntries(htmlDirs),
    htmlPluginProp = produceHtmlPlugins(htmlDirs).map(pluginProp=>{
        return new HtmlWebpackPlugin(
        
        )
    })

// set entries

let config = {
    devtool: 'cheap-module-eval-source-map',
    // mode:"development",
    entry: entries,
    output: {
        path: path.join(__dirname, 'dev'),
        filename: '[name].js',
        crossOriginLoading: 'anonymous'
    },
    resolve: {
        extensions: [".ts", ".js"],
        modules: [path.resolve(__dirname, "src"), "node_modules",path.resolve(__dirname)]
    },
    devServer: {
        contentBase:"./dev",
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /dist/,
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
    ].concat(htmlPluginProp)

}


module.exports = config;