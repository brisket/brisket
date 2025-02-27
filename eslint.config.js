import js from '@eslint/js';
import globals from 'globals';
import stylisticJs from '@stylistic/eslint-plugin-js';

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
    plugins: {
      '@stylistic/js': stylisticJs,
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
      '@stylistic/js/eol-last': ['error', 'always'],
    }
  }
];
