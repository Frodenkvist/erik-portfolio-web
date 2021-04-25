const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const srcPath = subdir => {
  return path.join(__dirname, 'src', subdir);
};

module.exports = () => {
  const removeEmpty = array => array.filter(p => !!p);

  return {
    entry: {
      app: path.join(__dirname, './src/index.tsx')
    },
    output: {
      filename: '[name].[hash].js',
      chunkFilename: '[name].[hash].chunk.js',
      path: path.join(__dirname, './dist/')
    },
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    },
    devtool: 'source-map',
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.json'],
      alias: {
        components: srcPath('components'),
        containers: srcPath('containers'),
        utils: srcPath('utils'),
        App: srcPath('App')
      }
    },
    devServer: {
      proxy: {
        '/api/**': {
          target: process.env.REST_URL || 'http://localhost:51426'
        }
      }
    },
    plugins: removeEmpty([
      new webpack.WatchIgnorePlugin([/css\.d\.ts$/]),
      new webpack.HashedModuleIdsPlugin(),

      /**
       * HtmlWebpackPlugin will make sure out JavaScript files are being called
       * from within our index.html
       */
      new HtmlWebpackPlugin({
        template: path.join(__dirname, './public/index.html'),
        filename: 'index.html',
        inject: 'body'
      }),
      new webpack.ProvidePlugin({
        fetch:
          'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch/dist/fetch.umd'
      }),
      new CopyPlugin([
        {
          from: 'public/polyfill.min.js',
          to: '.'
        }
      ])
    ]),
    module: {
      rules: [
        {
          test: /\.s?css$/,
          use: [
            'style-loader',
            {
              loader: 'typings-for-css-modules-loader',
              options: {
                modules: true,
                namedExport: true,
                localIdentName: '[path][name]__[local]--[hash:base64:5]'
              }
            },
            'postcss-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.tsx?$/,
          loader: 'babel-loader'
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          use: [
            'file-loader',
            {
              loader: 'image-webpack-loader',
              options: {
                disable: true
              }
            }
          ]
        },
        {
          enforce: 'pre',
          test: /\.js$/,
          loader: 'source-map-loader'
        }
      ]
    }
  };
};
