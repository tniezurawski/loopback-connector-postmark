module.exports = {
  root: true,
  env: {
    es6: true,
    node: true
  },
  extends: 'eslint:recommended',
  rules: {
    quotes: ['error', 'single']
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['prettier']
};
