module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'google',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:vue/recommended',
    'plugin:vuetify/recommended',
    'plugin:yaml/recommended',
  ],
  plugins: ['@typescript-eslint', 'vuejs-accessibility'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'max-len': ['error', { code: 100 }],
    indent: ['error', 2],
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    'comma-dangle': ['error', 'always-multiline'],
    'object-curly-spacing': ['error', 'always'],
    'require-jsdoc': 'off',
    'new-cap': 'off',
    'vue/multi-word-component-names': 'warn',
    'valid-jsdoc': 'off',
    'prefer-promise-reject-errors': 'off',
    'quote-props': 'off',
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true,
      },
    },
  ],
}
