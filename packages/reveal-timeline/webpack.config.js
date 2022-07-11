const path = require('path');

const isDevelopement = typeof process.env.CI === 'undefined';

module.exports = {
  mode: isDevelopement ? "development" : "production",
  devtool: isDevelopement ? 'eval-source-map' : 'source-map',
  entry: './src/timeline.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.less$/i,
        use: [
          // compiles Less to CSS
          "style-loader",
          "css-loader",
          "less-loader",
        ],
      },
      {
				test: /\.(jpe|jpg|woff|woff2|eot|ttf|svg)(\?.*$|$)/,
				type: 'asset/inline'
      },
      {
        test: /Timeline.js$/,
        loader: 'string-replace-loader',
        options: {
          search: /.*\"keydown\".*\n/,
          replace: ''
        }
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'timeline.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'RevealTimeline',
      type: 'umd',
      export: 'default'
    },
  }
};
