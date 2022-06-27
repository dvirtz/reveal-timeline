const path = require('path');

module.exports = {
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