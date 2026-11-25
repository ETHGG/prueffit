import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['node_modules/', 'vendor/', 'playwright-report/', 'test-results/', 'scripts/offline/'] },
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: { ecmaVersion: 2023, sourceType: 'module', globals: { ...globals.browser } },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrors: 'none' }],
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
  {
    // The service worker is a classic script.
    files: ['sw.js'],
    languageOptions: { sourceType: 'script', globals: { ...globals.serviceworker } },
  },
  {
    files: ['tests/**', 'e2e/**', 'scripts/**', '*.config.js'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
];
