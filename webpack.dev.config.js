var webpack = require("webpack");
var WebpackDevServer = require('webpack-dev-server');
var path = require("path");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var hotHMRScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true'
var config = {
    context: __dirname,
    entry: {
        // vendor: ['jquery', "webpack-dev-server/client?http://localhost:8080/", "webpack/hot/dev-server"],
    },
    output: {
        path: path.join(__dirname, "dist"),
        publicPath: "/dist/", 
        filename: "js/[name].js", 
        chunkFilename: 'chunk/[name].[chunkhash:5].js'
    },
    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel', 
            query: {
                presets: ['es2015'],
                plugins: ["transform-object-assign"]
            }
        }, {
            test: /\.scss$/,
            loader: "style!css!sass"
        }, {
            test: /\.css$/,
            loader: "style!css"
        }, {
            test: /\.png|\.jepg|\.jpg|\.gif/,
            loader: 'url-loader?limit=8000&name=imgs/[name].[ext]'
        }, {
            test: /\.ejs/,
            loader: 'ejs-compiled'
        }, {
            test: path.join(__dirname, 'src/libs/jquery-2.1.3.min.js'),
            loader: 'expose?jQuery'
        }],
        noParse: [],
    },
    resolve: {
        alias: {
            'jquery': path.join(__dirname, 'src/libs/jquery.2.1.3.min.js'),
            'vue': 'vue/dist/vue.js'
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"development"'
            }
        }),
        new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 20 }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    fakeUpdateVersion: 0
};

// 增加entry和html plugin
var addEntryToConfig = require('./webpackConf/addEntryToConfig');
config = addEntryToConfig(config, true);
module.exports = config;
