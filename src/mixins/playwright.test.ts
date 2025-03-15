import playwrightPlugin from 'eslint-plugin-playwright';
import typescriptEsLint from 'typescript-eslint';
import securityPlugin from 'eslint-plugin-security';
import unicornPlugin from 'eslint-plugin-unicorn';
import { playwright } from './playwright.js';
import { configSchema } from '../__test__/utils/configSchema.js';
import { difference, intersection } from '../__test__/utils/sets.js';
import { files } from '../utils/index.js';
import { CONFIG_NAME_PREFIX, prefixes } from '../constants.js';
import { getDeprecatedRules, getEnabledRules, getWarnRules, listRules } from '../__test__/utils/rules.js';
import { Linter } from 'eslint';

describe(playwright.name, () => {
  const config = playwright();

  const validRules = [
    ...new Linter().getRules().keys(),
    ...listRules(playwrightPlugin.rules, prefixes.playwright),
    ...listRules(securityPlugin.rules, prefixes.security),
    ...listRules(unicornPlugin.rules, prefixes.unicorn),
    ...listRules(typescriptEsLint.plugin.rules as any, prefixes.typescriptEsLint),
  ];
  const deprecatedRules = [
    ...getDeprecatedRules(new Linter().getRules()),
    ...getDeprecatedRules(playwrightPlugin.rules, prefixes.playwright),
    ...getDeprecatedRules(securityPlugin.rules, prefixes.security),
    ...getDeprecatedRules(unicornPlugin.rules, prefixes.unicorn),
    ...getDeprecatedRules(typescriptEsLint.plugin.rules as any, prefixes.typescriptEsLint),
  ];

  it('should create a valid eslint config', () => {
    const actual = () => configSchema.parse(config);
    expect(actual).not.toThrow();
  });

  it('should add the expected plugins to the config', () => {
    const actual = Object.keys(config.plugins ?? {}).sort();
    const expected = [prefixes.playwright].sort();
    expect(actual).toStrictEqual(expected);
  });

  it('should configure the expected rules', () => {
    expect(config.rules).toMatchSnapshot();
  });

  it('should set the name value', () => {
    expect(config.name).toBe(`${CONFIG_NAME_PREFIX}/${playwright.name}`);
  });

  it('should set the default files value', () => {
    const actual = config.files;
    const expected = [files.testSpec];
    expect(actual).toStrictEqual(expected);
  });

  it('should set the given files value', () => {
    const filesValue = ['files.txt'];
    const actual = playwright({ files: filesValue }).files;
    expect(actual).toStrictEqual(filesValue);
  });

  it('should only configure rules that exist', () => {
    const configuredRules = Object.keys(config.rules ?? {});
    const actual = difference(configuredRules, validRules);
    expect(actual).toStrictEqual([]);
  });

  it('should not configure rules that are deprecated', () => {
    const configuredAndEnabledRules = getEnabledRules(config.rules);
    const actual = intersection(configuredAndEnabledRules, deprecatedRules);
    expect(actual).toStrictEqual([]);
  });

  it('should not configure any rules as warn', () => {
    const configuredAndWarnRules = getWarnRules(config.rules);
    expect(configuredAndWarnRules).toStrictEqual([]);
  });
});
