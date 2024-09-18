module.exports = {
  testEnvironment: 'node',
  testMatch: [
    "**/*.test.ts"
  ],
  roots: [
    "<rootDir>/test"
  ],
  moduleFileExtensions: [
      "js",
      "json",
      "ts"
  ],
  transform: {
      "^.+\\.(t|j)s$": "ts-jest"
  },
  collectCoverageFrom: [
    "**/*.(t|j)s"
  ],
  coveragePathIgnorePatterns: [
    "node_modules",
    "test-config",
    "index.ts"
  ],
  coverageDirectory: "../coverage",
}