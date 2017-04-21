module.exports = {
  plugins: [
    'qunit',
  ],
  env: {
    qunit: true,
  },
  extend: 'qunit:recommended',

  rules: {
    // disabled because QUnit.module(), QUnit.test(), etc. should not use arrow functions
    'prefer-arrow-callback': 0,
  }
};
