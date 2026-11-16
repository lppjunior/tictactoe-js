module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'projects/bot/src/index.js',
    'projects/main/src/Tictactoe.js',
    'projects/main/src/use-cases/index.js'
  ],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100
    }
  },
  maxWorkers: '50%',
  transformIgnorePatterns: ['node_modules/(?!@lppjunior/pattern-js/)']
}
