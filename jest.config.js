const pack = require("./package");

module.exports = {
  collectCoverage: true,
  coverageDirectory: `<rootDir>/coverage`,
  displayName: pack.name,
  name: pack.name,
  preset: "ts-jest",
  rootDir: ".",
  testEnvironment: "node",
  testMatch: ["<rootDir>/**/*.test.ts"],
  testPathIgnorePatterns: [
    "<rootDir>/coverage/", //
    "<rootDir>/node_modules/",
  ],
};
