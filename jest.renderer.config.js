module.exports = {
  testEnvironment: 'jsdom',
  testMatch: [
    "**/*.test.ts"
  ],
  roots: [
    "<rootDir>/test/renderer"
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