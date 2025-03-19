module.exports = {
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!axios)"
  ],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^axios$": "axios/dist/axios.cjs"
  },
  testEnvironment: "jsdom",
};