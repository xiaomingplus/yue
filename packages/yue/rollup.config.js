import buble from 'rollup-plugin-buble';
import resolve from 'rollup-plugin-node-resolve';
export default {
    input: 'src/index.js',
    output: {
      file: 'dist/index.js',
      format: 'cjs'
    },
    plugins: [
        resolve(),
        buble()
    ]
  };