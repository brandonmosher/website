const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

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
        use: [MiniCssExtractPlugin.loader, "css-loader"],
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
        test: /\.(webp)$/i,
        type: "asset",
        generator: {
          filename: 'img/[hash][ext][query]'
        }
      },
      {
        test: /\.(ttf|woff|woff2)$/i,
        type: "asset",
        generator: {
          filename: 'font/[hash][ext][query]'
        }
      },
      {
        test: /\.(webp)$/i,
        use: [
          {
            loader: ImageMinimizerPlugin.loader,
            options: {
              minimizerOptions: {
                plugins: ["webp"],
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'index.css',
    }),
  ],
  resolve: {
    alias: {
      Component: path.resolve(__dirname, 'component'),
      Lib: path.resolve(__dirname, 'lib'),
      Polyfill: path.resolve(__dirname, 'polyfill'),
      Font: path.resolve(__dirname, 'font'),
    },
  },
};
