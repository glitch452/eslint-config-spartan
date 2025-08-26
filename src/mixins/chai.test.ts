import chaiFriendlyPlugin from 'eslint-plugin-chai-friendly';
import chaiExpectPlugin from 'eslint-plugin-chai-expect';
import typescriptEsLint from 'typescript-eslint';
import securityPlugin from 'eslint-plugin-security';
import unicornPlugin from 'eslint-plugin-unicorn';
import { Linter } from 'eslint';
import { chai } from './chai.js';
import { configSchema } from '../__test__/utils/configSchema.js';
import { difference, intersection } from '../__test__/utils/sets.js';
import { files } from '../utils/index.js';
import { CONFIG_NAME_PREFIX, prefixes } from '../constants.js';
import { getDeprecatedRules, getEnabledRules, getWarnRules, listRules } from '../__test__/utils/rules.js';

describe(chai.name, () => {
  const config = chai();

  const validRules = [
    ...new Linter({ configType: 'eslintrc' }).getRules().keys(),
    ...listRules(chaiFriendlyPlugin.rules, prefixes.chaiFriendly),
    ...listRules(chaiExpectPlugin.rules, prefixes.chaiExpect),
    ...listRules(securityPlugin.rules, prefixes.security),
    ...listRules(unicornPlugin.rules, prefixes.unicorn),
    ...listRules((typescriptEsLint.plugin as any).rules, prefixes.typescriptEsLint),
  ];
  const deprecatedRules = [
    ...getDeprecatedRules(new Linter({ configType: 'eslintrc' }).getRules()),
    ...getDeprecatedRules(chaiFriendlyPlugin.rules, prefixes.chaiFriendly),
    ...getDeprecatedRules(chaiExpectPlugin.rules, prefixes.chaiExpect),
    ...getDeprecatedRules(securityPlugin.rules, prefixes.security),
    ...getDeprecatedRules(unicornPlugin.rules, prefixes.unicorn),
    ...getDeprecatedRules((typescriptEsLint.plugin as any).rules, prefixes.typescriptEsLint),
  ];

  it('should create a valid eslint config', () => {
    const actual = () => configSchema.parse(config);
    expect(actual).not.toThrow();
  });

  it('should add the expected plugins to the config', () => {
    const actual = Object.keys(config.plugins ?? {}).sort();
    const expected = [prefixes.chaiExpect, prefixes.chaiFriendly].sort();
    expect(actual).toStrictEqual(expected);
  });

  it('should configure the expected rules', () => {
    expect(config.rules).toMatchSnapshot();
  });

  it('should set the name value', () => {
    expect(config.name).toBe(`${CONFIG_NAME_PREFIX}/${chai.name}`);
  });

  it('should set the default files value', () => {
    const actual = config.files;
    const expected = [files.testSpec, files.cypress];
    expect(actual).toStrictEqual(expected);
  });

  it('should set the given files value', () => {
    const filesValue = ['files.txt'];
    const actual = chai({ files: filesValue }).files;
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
