import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jasmine,
      }
    },
    rules: {
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'no-var': 'error',
      'prefer-const': ['error', {
        'destructuring': 'any',
        'ignoreReadBeforeAssign': true
      }],
      'strict': ['error', 'safe'],
      'comma-dangle': ['error', 'only-multiline'],
      'object-shorthand': ['error', 'always', {
        'avoidQuotes': true
      }],
      'no-trailing-spaces': 'error',
      'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 1, 'maxBOF': 0 }],
      'prefer-template': 'error',
      'no-unused-vars': ['error', {
        caughtErrors: 'none',
      }],
      'no-empty': ['error', {
        'allowEmptyCatch': true,
      }],
      'template-curly-spacing': ['error', 'never'],
    }
  }
];