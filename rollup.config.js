import typescript from 'rollup-plugin-typescript2';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import * as fs from 'fs-extra';
import * as prettier from 'prettier';

module.exports = {
  input: './src/index.ts',
  output: {
    file: 'lib/index.js',
    format: 'cjs',
    freeze: false
  },
  plugins: [
    typescript(),
    nodeResolve({ preferBuiltins: true }),
    commonjs({
      namedExports: {
        'fs-extra': Object.keys(fs),
        prettier: Object.keys(prettier)
      },
      /**
       * '@microsoft/typescript-etw' is typescript log lib only runs on windows
       * './parser-flow' is one of 'prettier' module, `r.process` <- r is not defined
       *
       */
      ignore: ['@microsoft/typescript-etw', './parser-flow']
    })
  ]
};
