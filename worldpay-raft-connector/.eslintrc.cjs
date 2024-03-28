module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-undef': 'error',
    'no-console': 'error',
    'no-const-assign': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
  env: {
    es6: true,
    jest: true,
    node: true, //adds things like process to global
  },
}
