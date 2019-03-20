'use strict';

module.exports = {
  verbose: true,
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    '!coverage/**',
    '!**/node_modules/**',
    '!*.config.js',
    '!test/fixtures/**',
    '!test/utils/**',
    '!routes/**',
    '!strategies/index.js',
    '**/*.js'
  ],
  coverageDirectory: 'coverage'
};
