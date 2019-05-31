const path = require('path')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const devConfig = require('./webpack.dev.js')
const prodConfig = require('./webpack.prod.js')

const commonConfig = {
  entry: './src/js/index.js',
  output: {
    path: path.resolve('dist'),
  },
  module: {
    rules: [
      {
        test: /\.(eot|ttf|svg|woff|otf|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: './style/font/',
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              outputPath: './img/',
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: [
          { loader: 'html-withimg-loader' },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
}

module.exports = (env) => {
  if (env && env.production) {
    return merge(commonConfig, prodConfig)
  }
  return merge(commonConfig, devConfig)
}
