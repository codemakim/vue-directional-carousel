/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/typescript/recommended',
    'plugin:eslint-config-airbnb-base'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  fix: true
}
