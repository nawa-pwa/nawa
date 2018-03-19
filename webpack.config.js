const path = require('path');


const COMPILE = (process.env.NODE_ENV === 'compile');

let config = {
    entry: {
        'qq/sw': path.join(__dirname,'./src/qq/main/index'),
        'activity/grand-ceremony/sw':path.join(__dirname,'./src/activity/grand-ceremony/main/index')
    },
    output: {
        path: path.join(__dirname, './public/webserver/'),
        filename: '[name].js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].min.js',
        libraryTarget:"umd",
        library:"httplive",
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
    }

}

if (!COMPILE) {
    config.devtool = 'cheap-module-eval-source-map';
    config.output.path = path.join(__dirname,'dist');
}

module.exports = config;