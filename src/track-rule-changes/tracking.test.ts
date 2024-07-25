import { Linter, Rule } from 'eslint';
import { listRules } from '../__test__/utils/rules.js';
import { prefixes } from '../constants.js';
import * as mdxPlugin from 'eslint-plugin-mdx';
import chaiFriendlyPlugin from 'eslint-plugin-chai-friendly';
import cypressPlugin from 'eslint-plugin-cypress/flat';
import i18nextPlugin from 'eslint-plugin-i18next';
import i18nJsonPlugin from 'eslint-plugin-i18n-json';
import importPlugin from 'eslint-plugin-import';
import jsDocPlugin from 'eslint-plugin-jsdoc';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import mochaPlugin from 'eslint-plugin-mocha';
import nextPlugin from '@next/eslint-plugin-next';
import prettierConfig from 'eslint-config-prettier';
import promisePlugin from 'eslint-plugin-promise';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactPlugin from 'eslint-plugin-react';
import regExpPlugin from 'eslint-plugin-regexp';
import securityPlugin from 'eslint-plugin-security';
import storybookPlugin from 'eslint-plugin-storybook';
import stylistic from '@stylistic/eslint-plugin';
import tailwindCssPlugin from 'eslint-plugin-tailwindcss';
import testingLibraryPlugin from 'eslint-plugin-testing-library';
import typescriptEnumPlugin from 'eslint-plugin-typescript-enum';
import typescriptEsLint from 'typescript-eslint';
import unicornPlugin from 'eslint-plugin-unicorn';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import vitestPlugin from 'eslint-plugin-vitest';

const stylisticPlugin = stylistic as unknown as (typeof stylistic)['default'];

describe('Track changes in available plugin rules', () => {
  const testTable = [
    { name: '@next/eslint-plugin-next', rules: listRules(nextPlugin.rules, prefixes.next, true) },
    { name: '@stylistic/eslint-plugin', rules: listRules(stylisticPlugin.rules, prefixes.stylistic, true) },
    { name: 'eslint-config-prettier', rules: listRules(prettierConfig.rules, undefined, true) },
    { name: 'eslint-plugin-chai-friendly', rules: listRules(chaiFriendlyPlugin.rules, prefixes.chaiFriendly, true) },
    { name: 'eslint-plugin-cypress', rules: listRules(cypressPlugin.rules, prefixes.cypress, true) },
    { name: 'eslint-plugin-i18n-json', rules: listRules(i18nJsonPlugin.rules, prefixes.i18nJson, true) },
    { name: 'eslint-plugin-i18next', rules: listRules(i18nextPlugin.rules, prefixes.i18next, true) },
    { name: 'eslint-plugin-import', rules: listRules(importPlugin.rules, prefixes.import, true) },
    { name: 'eslint-plugin-jsdoc', rules: listRules(jsDocPlugin.rules, prefixes.jsDoc, true) },
    { name: 'eslint-plugin-jsx-a11y', rules: listRules(jsxA11yPlugin.rules, prefixes.jsxA11y, true) },
    { name: 'eslint-plugin-mdx', rules: listRules(mdxPlugin.rules, prefixes.mdx, true) },
    { name: 'eslint-plugin-mocha', rules: listRules(mochaPlugin.rules, prefixes.mocha, true) },
    { name: 'eslint-plugin-promise', rules: listRules(promisePlugin.rules, prefixes.promise, true) },
    { name: 'eslint-plugin-react-hooks', rules: listRules(reactHooksPlugin.rules, prefixes.reactHooks, true) },
    { name: 'eslint-plugin-react', rules: listRules(reactPlugin.rules, prefixes.react, true) },
    { name: 'eslint-plugin-regexp', rules: listRules(regExpPlugin.rules, prefixes.regExp, true) },
    { name: 'eslint-plugin-security', rules: listRules(securityPlugin.rules, prefixes.security, true) },
    {
      name: 'eslint-plugin-storybook',
      rules: listRules(storybookPlugin.rules as unknown as Record<string, Rule.RuleModule>, prefixes.storybook, true),
    },
    { name: 'eslint-plugin-tailwindcss', rules: listRules(tailwindCssPlugin.rules, prefixes.tailwindCss, true) },
    {
      name: 'eslint-plugin-testing-library',
      rules: listRules(testingLibraryPlugin.rules, prefixes.testingLibrary, true),
    },
    {
      name: 'eslint-plugin-typescript-enum',
      rules: listRules(typescriptEnumPlugin.rules, prefixes.typescriptEnum, true),
    },
    { name: 'eslint-plugin-unicorn', rules: listRules(unicornPlugin.rules, prefixes.unicorn, true) },
    { name: 'eslint-plugin-unused-imports', rules: listRules(unusedImportsPlugin.rules, prefixes.unusedImports, true) },
    { name: 'eslint-plugin-vitest', rules: listRules(vitestPlugin.rules, prefixes.vitest, true) },
    { name: 'eslint', rules: listRules(new Linter().getRules(), undefined, true) },
    {
      name: 'typescript-eslint',
      rules: listRules(typescriptEsLint.plugin.rules as any, prefixes.typescriptEsLint, true),
    },
  ] as const;

  it.each(testTable)('should snapshot the list of rules for "$name"', ({ rules }) => {
    expect(rules).toMatchSnapshot();
  });
});
