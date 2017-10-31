var webpack = require("webpack");
var path = require("path");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
// 上线后的资源路径，需要修改
var publicPath = '/circleOperation/dist/'
var config = {
    context: __dirname,
    entry: {
        // vendor: ['jquery']
        // index: ['./src/js/index.js'],
        // user: ['./src/js/user.js'],
    },
    output: {
        path: path.join(__dirname, "dist"),
        publicPath: publicPath, // relative path for github pages
        filename: "js/[name].[chunkhash:5].js", // no hash in main.js because index.html is a static page
        chunkFilename: 'chunk/[name].[chunkhash:5].js',
    },
    // recordsOutputPath: path.join(__dirname, "records.json"),
    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel', // 'babel-loader' is also a legal name to reference
            query: {
                presets: ['es2015'],
                plugins: ["transform-object-assign"]
            }
        }, {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
        }, {
            test: /\.css$/,
            loader: "style!css"
        }, {
            test: /\.png|\.jepg|\.jpg|\.gif/,
            loader: 'url-loader?limit=8000&name=imgs/[name].[hash:5].[ext]'
        }, {
            test: /\.ejs/,
            loader: 'ejs-compiled'
        }],
        noParse: [],
    },
    // devtool: "source-map",
    externals: {
        // 'jquery': 'jquery'
        //don't bundle the 'react' npm package with our bundle.js
        //but get it from a global 'React' variable
    },
    resolve: {
        extensions: ['', '.js'],
        alias: {
            'jquery': path.join(__dirname, 'src/libs/jquery.2.1.3.min.js'),
            'vue': 'vue/dist/vue.js'
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"production"'
            }
        }),
        new ExtractTextPlugin("css/[name].[contenthash:5].css", {
            disable: false,
            allChunks: true
        }),
        new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 20 }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ],
    fakeUpdateVersion: 0
};

var addEntryToConfig = require('./webpackConf/addEntryToConfig');
config = addEntryToConfig(config, false);

module.exports = config;
