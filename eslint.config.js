// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = tseslint.config(
    {
    files: ['src/**/*.ts'],
    ignores: ['.angular/**', 'dist/**'],
    extends: [
        eslint.configs.recommended,
        ...tseslint.configs.recommended,
        ...tseslint.configs.stylistic,
        ...angular.configs.tsRecommended,
        eslintConfigPrettier,
    ],
    processor: angular.processInlineTemplates,
    rules: {
        '@angular-eslint/directive-selector': 'off',
        '@angular-eslint/component-selector': 'off',
        'prefer-arrow-callback': 'error',
        'prefer-const': 'error',
        'sort-imports': [
            'error',
            {
                ignoreCase: true,
                ignoreDeclarationSort: true,
                allowSeparatedGroups: true,
            },
        ],

        // Security
        'no-eval': 'error',
        'no-implied-eval': 'error',
        },
    },
    {
        files: ['**/*.html'],
        extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
        rules: {},
    },
);
