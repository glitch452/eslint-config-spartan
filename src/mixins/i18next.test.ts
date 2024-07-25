import i18nextPlugin from 'eslint-plugin-i18next';
import { i18next } from './i18next.js';
import { configSchema } from '../__test__/utils/configSchema.js';
import { difference, intersection } from '../__test__/utils/sets.js';
import { files } from '../utils/index.js';
import { configNamePrefix, prefixes } from '../constants.js';
import { getDeprecatedRules, getEnabledRules, getWarnRules, listRules } from '../__test__/utils/rules.js';

describe(i18next.name, () => {
  const config = i18next();

  const validRules = listRules(i18nextPlugin.rules, prefixes.i18next);
  const deprecatedRules = getDeprecatedRules(i18nextPlugin.rules, prefixes.i18next);

  it('should create a valid eslint config', () => {
    const actual = () => configSchema.parse(config);
    expect(actual).not.toThrow();
  });

  it('should add the expected plugins to the config', () => {
    const actual = Object.keys(config.plugins ?? {}).sort();
    const expected = [prefixes.i18next].sort();
    expect(actual).toStrictEqual(expected);
  });

  it('should configure the expected rules', () => {
    expect(config.rules).toMatchSnapshot();
  });

  it('should set the name value', () => {
    expect(config.name).toBe(`${configNamePrefix}/${i18next.name}`);
  });

  it('should set the default files value', () => {
    const actual = config.files;
    const expected = [files.jsTs];
    expect(actual).toStrictEqual(expected);
  });

  it('should set the given files value', () => {
    const fileValue = ['files.txt'];
    const actual = i18next({ files: fileValue }).files;
    expect(actual).toStrictEqual(fileValue);
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
