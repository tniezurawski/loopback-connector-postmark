module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: 'eslint:recommended',
  rules: {
    quotes: ['error', 'single']
  },
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  plugins: ['prettier']
};
