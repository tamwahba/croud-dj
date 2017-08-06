const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const path = require('path');
const webpack = require('webpack');
const WebpackMd5Hash = require('webpack-md5-hash');

const NODE_ENV = process.env.NODE_ENV;

const IS_DEVELOPMENT = NODE_ENV === 'development';
const IS_PRODUCTION = NODE_ENV === 'production';
const IS_TEST = NODE_ENV === 'test';

const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 3000;

const loaders = {
  font: {
    test: /\.(ttf|eot|woff|woff2)$/,
    loader: 'file-loader',
    options: {
      name: 'fonts/[name].[ext]',
    },
  },
  js: { test: /\.jsx?$/, exclude: /node_modules/, loader: ['babel-loader'] },
  json: { test: /\.json$/, loader: ['json-loader'] },
  less: {
    test: /\.(less|css)$/,
    loaders: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
  },
  svg: { test: /\.svg$/, loader: 'svg-sprite-loader', options: { extract: true, spriteFileName: 'icons.svg' } },
};

const config = {
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [path.resolve('.'), 'node_modules'],
  },
  plugins: [
    new SpriteLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    }),
  ],
};

if (IS_DEVELOPMENT || IS_PRODUCTION) {
  config.entry = {
    main: ['./client/main.jsx'],
  };
  config.output = {
    filename: '[name].js',
    path: path.resolve('./site'),
    publicPath: '/',
  };
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.FIREBASE_API_KEY': JSON.stringify(process.env.FIREBASE_API_KEY),
      'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
      'process.env.FIREBASE_DB_URL': JSON.stringify(process.env.FIREBASE_DB_URL),
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      hash: false,
      inject: 'body',
      template: './client/index.html',
    }));
}

if (IS_DEVELOPMENT) {
  config.devtool = 'cheap-module-eval-source-map';
  config.entry.main.unshift(
    'react-hot-loader/patch',
    'babel-polyfill',
    `webpack-dev-server/client?http://${HOST}:${PORT}`,
    'webpack/hot/only-dev-server');
  config.module = {
    rules: [
      loaders.font,
      loaders.js,
      loaders.less,
      loaders.svg,
    ],
  };
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin());
  config.devServer = {
    contentBase: './client',
    historyApiFallback: true,
    host: HOST,
    hot: true,
    port: PORT,
    publicPath: config.output.publicPath,
    stats: {
      cached: true,
      cachedAssets: true,
      chunks: true,
      chunkModules: true,
      colors: true,
      hash: false,
      reasons: true,
      timings: true,
      version: false,
    },
  };
}

if (IS_PRODUCTION) {
  config.devtool = 'source-map';
  config.output.filename = '[name].[chunkhash].js';
  config.module = {
    rules: [
      loaders.font,
      loaders.js,
      loaders.svg,
      {
        test: /\.(less|css)$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
                sourceMap: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'less-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        }),
      },
    ],
  };
  config.plugins.push(
    new WebpackMd5Hash(),
    new ExtractTextPlugin({
      allChunks: true,
      filename: 'styles.[contenthash].css',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        dead_code: true,
        screw_ie8: true,
        unused: true,
        warnings: false,
      },
    }));
}

if (IS_TEST) {
  config.devtool = 'inline-source-map';
  config.module = {
    rules: [
      loaders.font,
      loaders.js,
      loaders.json,
      loaders.less,
      loaders.svg,
      {
        test: /\.jsx?$/,
        loader: 'istanbul-instrumenter-loader',
        include: path.resolve('./client'),
        exclude: [/node_modules/, /\.test\.jsx?$/],
        options: {
          esModules: true,
        },
      },
    ],
  };
  config.externals = {
    'react/addons': 'react',
    'react/lib/ExecutionEnvironment': 'react',
    'react/lib/ReactContext': 'react',
    'react-addons-test-utils': 'react-dom',
  };
}

module.exports = config;
