const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const entry = glob.sync('./component/**/index.js').reduce((acc, pathname) => {
  acc[pathname.replace('./', '')] = pathname;
  return acc
}, {});

const htmlWebpackPlugins = Object.keys(entry).map(key =>
  new HtmlWebpackPlugin({
    filename: key.replace('.js', '.html'),
    template: key.replace('.js', '.html'),
    chunks: [key],
  }));

module.exports = {
  mode: 'development',
  entry,
  output: {
    filename: '[name]',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        loader: 'css-loader',
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
    ],
  },
  plugins: [
    ...htmlWebpackPlugins
  ],
  resolve: {
    alias: {
      Component: path.resolve(__dirname, 'component'),
      Lib: path.resolve(__dirname, 'lib'),
      Polyfill: path.resolve(__dirname, 'polyfill'),
    },
  },
  optimization: {
    minimize: false
  },
};
