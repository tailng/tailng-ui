import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import nxPlugin from '@nx/eslint-plugin';

const tsEslintRulesOffForNonTs = Object.fromEntries(
  Object.keys(tseslint.plugin.rules).map((ruleName) => [
    `@typescript-eslint/${ruleName}`,
    'off',
  ]),
);

export default [
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.nx/**',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
    ...tseslint.configs.disableTypeChecked,
    languageOptions: {
      ...tseslint.configs.disableTypeChecked.languageOptions,
      parserOptions: {
        ...tseslint.configs.disableTypeChecked.languageOptions?.parserOptions,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      ...tseslint.configs.disableTypeChecked.rules,
      ...tsEslintRulesOffForNonTs,
    },
  },
  {
    files: ['**/*.html'],
    ...tseslint.configs.disableTypeChecked,
    rules: {
      ...tseslint.configs.disableTypeChecked.rules,
      ...tsEslintRulesOffForNonTs,
    },
  },

  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['tools/vite/*.ts'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'unused-imports': unusedImports,
      import: importPlugin,
      '@nx': nxPlugin,
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/switch-exhaustiveness-check': 'error',

      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': 'error',

      'max-lines-per-function': [
        'error',
        {
          max: 40,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      complexity: ['error', { max: 8 }],
      'max-depth': ['error', 3],
      'max-params': ['error', 3],

      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variableLike',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: 'enumMember',
          format: ['UPPER_CASE'],
        },
        {
          selector: 'variable',
          modifiers: ['const'],
          format: ['camelCase', 'UPPER_CASE'],
        },
      ],

      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      'import/no-default-export': 'error',
      'import/order': [
        'error',
        {
          groups: [
            ['builtin', 'external'],
            'internal',
            ['parent', 'sibling', 'index'],
          ],
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/no-cycle': ['error', { maxDepth: 1 }],
      'import/no-internal-modules': [
        'error',
        {
          forbid: ['@tailng-ui/**/src/**'],
        },
      ],
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        { accessibility: 'explicit' },
      ],

      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [
            '^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$',
            '^.*/tools/vite/tailng-ui-source-aliases$',
            '^@tailng-ui/(?:cdk/(?:adapters|a11y|collections|core|overlay|runtime)|icons/core)$',
          ],
          depConstraints: [
            {
              sourceTag: 'scope:tailng',
              onlyDependOnLibsWithTags: ['scope:tailng'],
            },
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: [
                'type:cdk',
                'type:theme',
                'type:icons',
                'type:utils',
              ],
            },
            {
              sourceTag: 'type:cdk',
              onlyDependOnLibsWithTags: ['type:utils'],
            },
            {
              sourceTag: 'type:theme',
              onlyDependOnLibsWithTags: ['type:utils', 'type:theme'],
            },
          ],
        },
      ],
    },
  },

  {
    files: ['libs/**/*.ts'],
    rules: {
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/prefer-readonly-parameter-types': 'warn',
      'unused-imports/no-unused-vars': 'error',
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.test.ts', '**/__tests__/**/*.ts'],
    rules: {
      'max-lines-per-function': 'off',
      complexity: 'off',
      'max-params': 'off',
      '@typescript-eslint/prefer-readonly': 'off',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  {
    files: ['tools/**/*.mjs'],
    rules: {
      'no-undef': 'off',
    },
  },

  {
    files: ['apps/**/*.ts'],
    rules: {
      'no-console': 'warn',
      'max-params': ['warn', 4],
    },
  },
  {
    files: [
      '**/vitest.config.ts',
      '**/vite.config.ts',
      '**/*.config.ts',
      '**/eslint.config.ts',
    ],
    rules: {
      'import/no-default-export': 'off',
    },
  },
  {
    files: ['**/*.d.ts'],
    rules: {
      'import/no-default-export': 'off',
    },
  },
  

  prettier,
];
