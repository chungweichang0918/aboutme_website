import astro from 'eslint-plugin-astro';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['dist/**', '.astro/**', '.wrangler/**', 'playwright-report/**', 'test-results/**', 'public/admin/assets/**', 'public/admin/mode.js', 'public/sw.js'] },
  ...tseslint.configs.recommended,
  ...astro.configs['flat/recommended'],
  { languageOptions: { globals: { ...globals.browser, ...globals.node, ...globals.worker } } },
];
