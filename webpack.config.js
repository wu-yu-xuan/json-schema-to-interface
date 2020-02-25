/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

const cwd = process.cwd();

module.exports = {
  entry: path.resolve(cwd, './src/index.ts'),
  mode: 'production',
  output: {
    path: path.resolve(cwd, './lib'),
    filename: 'index.js'
  },
  resolve: { extensions: ['.ts', '.js'] },
  target: 'node',
  // do not need node polyfill or other handle
  node: false,
  module: {
    rules: [
      {
        test: /.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              configFile: path.resolve(cwd, './tsconfig.json')
            }
          }
        ]
      }
    ]
  }
};
