module.exports = {
  verbose: true,
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ]
};