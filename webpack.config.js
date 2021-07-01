const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const entry = glob.sync('./component/**/src/index.js').reduce((acc, path) => {
  acc[path.replace('/src/index.js', '')] = {import: path};
  return acc
}, {});

entry['./'] = {
  import: './src/index.js'
};

console.log(entry);
const htmlWebpackPlugins = Object.entries(entry).map(([key, value]) =>
  new HtmlWebpackPlugin({
    filename: `${key}/dist/index.html`,
    template: `${key}/src/index.html`,
    chunks: [key],
}));

module.exports = {
  mode: 'production',
  entry,
  output: {
    filename: '[name]/dist/index.js',
    path: path.resolve(__dirname),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        loader: 'css-loader',
        options: { url: false },
      },
      {
        test: /\.html$/i,
        use: 'html-loader',
      }
    ],
  },
  plugins: [
    ...htmlWebpackPlugins
  ],
  resolve: {
    alias: {
      Component: path.resolve(__dirname, 'component/'),
      ComponentAbstract: path.resolve(__dirname, 'component-abstract/'),
      Lib: path.resolve(__dirname, 'lib/'),
    },
  },
};
