module.exports = {
  'collectCoverage': true,
  'collectCoverageFrom': [
    'src/**/*.{js,ts,vue}',
    '!<rootDir>/node_modules/'
  ],
  moduleFileExtensions: [
    'js',
    'ts',
    'json',
    'vue'
  ],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    // process `*.vue` files with `vue-jest`
    '.*\\.(vue)$': 'vue-jest',
    '.*\\.([tj]s)$': 'babel-jest'
  }
}
