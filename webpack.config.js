const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: { 'index': './src/index.js' },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
        exclude: /component\/.*\.css$/i,
      },
      {
        test: /component\/.*\.css$/i,
        loader: 'css-loader',
      },
      {
        test: /component\/.*\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.woff2$/i,
        type: 'asset',
        generator: {
          filename: 'font/[hash][ext][query]'
        }
      },
      {
        test: /\.(webp)$/i,
        type: 'asset',
        generator: {
          filename: 'img/[hash][ext][query]'
        }
      },
      {
        test: /\.(webp)$/i,
        use: [
          {
            loader: ImageMinimizerPlugin.loader,
            options: {
              minimizerOptions: {
                plugins: ['webp'],
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'index.css',
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      favicon: 'img/icons8-developer-100.webp',
      minify: {
        collapseWhitespace: true,
        keepClosingSlash: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        minifyJS: true,
        minifyCSS: true
    }
    }),
    new PreloadWebpackPlugin({
      rel: 'preload',
      as: 'font',
      include: 'allAssets',
      fileWhitelist: [/\.woff2$/i],
  }),
    new CompressionPlugin({
      deleteOriginalAssets: true,
    }),
  ],
  resolve: {
    alias: {
      Component: path.resolve(__dirname, 'component'),
      Lib: path.resolve(__dirname, 'lib'),
      Polyfill: path.resolve(__dirname, 'polyfill'),
      Font: path.resolve(__dirname, 'font'),
      Img: path.resolve(__dirname, 'img'),
    },
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
      '...'
    ],
  },
};
