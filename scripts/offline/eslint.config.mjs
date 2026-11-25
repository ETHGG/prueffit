// Offline ESLint config (since 2.21.25): the cloud sessions cannot install @eslint/js and globals,
// so this config rebuilds "recommended" from ESLint's built-in rules. no-undef is off because the
// globals package is missing; the CI (npm run lint) still checks everything with the full config.
import { createRequire } from 'node:module';
const require = createRequire(process.env.ESLINT_PKG + '/package.json');
const { builtinRules } = require('./lib/unsupported-api.js');
const recommended = {};
for (const [name, rule] of builtinRules) if (rule.meta?.docs?.recommended) recommended[name] = 'error';
delete recommended['no-undef'];
// Rules recommended only since ESLint 10 (the project pins ESLint 9 in package.json).
for (const r of ['no-useless-assignment', 'preserve-caught-error', 'no-unassigned-vars']) delete recommended[r];

export default [
  { ignores: ['node_modules/', 'vendor/', 'playwright-report/', 'test-results/', 'scripts/offline/'] },
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: { ecmaVersion: 2023, sourceType: 'module' },
    rules: {
      ...recommended,
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrors: 'none' }],
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
  { files: ['sw.js'], languageOptions: { sourceType: 'script' } },
];
