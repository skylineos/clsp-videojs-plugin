'use strict';

module.exports = {
  "extends": "standard",
  "parser": "babel-eslint",
  "ecmaFeatures": {
    "classes": true,
  },
  "rules": {
    "comma-dangle": [2, "always-multiline"],
    "semi": [2, "always"],
    "key-spacing": 0,
    "camelcase": 0,
    "brace-style": [2, "stroustrup"],
    "prefer-promise-reject-errors": 1,
  },
  "globals": {
    "Log": false,
  },
};
