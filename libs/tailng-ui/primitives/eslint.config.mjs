import nx from '@nx/eslint-plugin';
import tseslint from 'typescript-eslint';
import baseConfig from '../../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    files: ['**/*.json'],
    ...tseslint.configs.disableTypeChecked,
    plugins: {
      '@nx': nx,
    },
    rules: {
      ...tseslint.configs.disableTypeChecked.rules,
      '@nx/dependency-checks': [
        'error',
        {
          ignoredDependencies: ['tslib'],
          ignoredFiles: [
            '{projectRoot}/eslint.config.{js,cjs,mjs,ts,cts,mts}',
            '{projectRoot}/vitest.config.ts',
            '{projectRoot}/**/*.spec.ts',
            '{projectRoot}/**/*.test.ts',
          ],
        },
      ],
    },
    languageOptions: {
      ...tseslint.configs.disableTypeChecked.languageOptions,
      parser: await import('jsonc-eslint-parser'),
    },
  },
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'tng',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'tng',
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    // Override or add rules here
    rules: {},
  },
];
