const path = require('path');
const Uglifyjs = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const COMPILE = (process.env.NODE_ENV === 'compile');

let config = {
    // mode:"production",
    devtool: 'hidden-source-map',
    entry: {
        'nawa': path.join(__dirname, './src/index')
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].min.js',
        libraryTarget: 'umd',
        library: "nawa",
    },
    resolve: {
        extensions: [".ts", ".js"],
        modules: [path.resolve(__dirname, "src"), "node_modules"]
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: [
                    {
                        loader: 'babel-loader',
                        query: {
                            presets: ['es2015'],
                            // "plugins": [
                            //     ["transform-decorators-legacy"],
                            //     [
                            //         "transform-runtime", {
                            //             "polyfill": false,
                            //             "regenerator": true
                            //         }
                            //     ]
                            // ]
                        }
                    }
                ]
            },
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist'])
        ,new Uglifyjs({
            uglifyOptions: {
                compress: {
                    pure_funcs: ['debug'],
                },
                warnings: false,
            }

        })]

}

module.exports = config;