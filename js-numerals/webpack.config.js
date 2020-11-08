const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack'); 

module.exports = {
    entry: './src/scripts/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader'
          ]
        },
      ],
    },
    resolve: {
      extensions: [ '.ts', '.js', 'scss' ],
    },
    plugins: [
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({template: './src/index.html'})
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 9000
    }
}