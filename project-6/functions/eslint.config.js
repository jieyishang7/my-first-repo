const js = require("@eslint/js");

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        console: "readonly",
        fetch: "readonly"
      }
    },
    rules: {
      "max-len": ["error", { "code": 100, "ignoreUrls": true }]
    }
  }
];

