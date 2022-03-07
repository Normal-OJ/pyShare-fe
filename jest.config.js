module.exports = {
  setupFiles: ['./tests/unit/setup.js'],
  moduleNameMapper: {
    '^vue$': 'vue/dist/vue.common.js',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.js': 'babel-jest',
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.vue$': 'vue-jest',
  },
  moduleFileExtensions: ['vue', 'js', 'ts'],
  testEnvironment: 'jsdom',
}
