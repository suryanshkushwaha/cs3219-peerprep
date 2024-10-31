const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    codemirror: './codemirror.js'
  },
  output: {
    globalObject: 'self',
    path: path.resolve(__dirname, './dist/'),
    filename: '[name].bundle.js',
    publicPath: '/codemirror/dist/'
  },
  devServer: {
    proxy: [
      {
        context: ['/ws'],
        target: 'ws://localhost:3002',
        ws: true,
        changeOrigin: true
      }
    ],
    static: {
      directory: path.join(__dirname),
    },
    open: {
      target: '/codemirror.html',  // Specify the path to open on startup
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './codemirror.html',
      filename: 'index.html'
    })
  ]
};
