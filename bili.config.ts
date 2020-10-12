import { Config } from 'bili'

const config: Config = {
  input: 'src/index.ts',

  output: {
    fileName: 'async-computed.[format][min].js',
    moduleName: 'asyncComputed',
    format: [
      'cjs',
      'cjs-min',
      'es',
      'umd',
      'umd-min'
    ]
  },

  externals: [
    'vue',
    '@vue/composition-api'
  ]
}

export default config
