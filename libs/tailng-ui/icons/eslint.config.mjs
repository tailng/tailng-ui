import angularTemplateParser from '@angular-eslint/template-parser';
import nx from '@nx/eslint-plugin';
import tseslint from 'typescript-eslint';
import baseConfig from '../../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    files: ['**/*.html'],
    ...tseslint.configs.disableTypeChecked,
    languageOptions: {
      ...tseslint.configs.disableTypeChecked.languageOptions,
      parser: angularTemplateParser,
      parserOptions: {
        ...tseslint.configs.disableTypeChecked.languageOptions?.parserOptions,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      ...tseslint.configs.disableTypeChecked.rules,
    },
  },
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
];
