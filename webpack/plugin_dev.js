const glob = require("glob");
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const striPlugin = require("webpack-subresource-integrity");

let plugins = [
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
];

let htmlArr = glob.sync(path.join(__dirname,"../test/**/*.html")),
    htmlTitle =  /test\/(.*)\.html/,
    fileNameHTML = /test\/.*\.html/,
    title,
    res;

for(var html of htmlArr){
    res = htmlTitle.exec(html);
    title = res[1];
    plugins.push(
        new HtmlWebpackPlugin({
            filename:res[0].substring(5),
            template:res[0],
            title:"Nawa-Test",
            inject:true,
            chunks:[title]
        })
    )
}

console.log(plugins);


module.exports = plugins;