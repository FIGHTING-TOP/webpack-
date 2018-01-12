var webpack = require('webpack');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  },
  plugins: [//与使用命令'webpack -p'效果相同  
    new uglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}
