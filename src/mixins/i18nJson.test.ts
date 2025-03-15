import i18nJsonPlugin from 'eslint-plugin-i18n-json';
import { i18nJson } from './i18nJson.js';
import { configSchema } from '../__test__/utils/configSchema.js';
import { difference, intersection } from '../__test__/utils/sets.js';
import { files } from '../utils/index.js';
import { CONFIG_NAME_PREFIX, prefixes } from '../constants.js';
import { getDeprecatedRules, getEnabledRules, getWarnRules, listRules } from '../__test__/utils/rules.js';

describe(i18nJson.name, () => {
  const config = i18nJson();

  const validRules = [...listRules(i18nJsonPlugin.rules, prefixes.i18nJson)];
  const deprecatedRules = [...getDeprecatedRules(i18nJsonPlugin.rules, prefixes.i18nJson)];

  it('should create a valid eslint config', () => {
    const actual = () => configSchema.parse(config);
    expect(actual).not.toThrow();
  });

  it('should add the expected plugins to the config', () => {
    const actual = Object.keys(config.plugins ?? {}).sort();
    const expected = [prefixes.i18nJson].sort();
    expect(actual).toStrictEqual(expected);
  });

  it('should configure the expected rules', () => {
    expect(config.rules).toMatchSnapshot();
  });

  it('should set the name value', () => {
    expect(config.name).toBe(`${CONFIG_NAME_PREFIX}/${i18nJson.name}`);
  });

  it('should set the default files value', () => {
    const actual = config.files;
    const expected = [files.json];
    expect(actual).toStrictEqual(expected);
  });

  it('should set the given files value', () => {
    const fileValue = ['files.txt'];
    const actual = i18nJson({ files: fileValue }).files;
    expect(actual).toStrictEqual(fileValue);
  });

  it('should enable the "identical-keys" rule and set the given filePath when the identicalKeysFilePath is set', () => {
    const identicalKeysFilePath = '<path>';
    const actual = i18nJson({ identicalKeysFilePath }).rules;
    const expected = { 'i18n-json/identical-keys': ['error', { filePath: identicalKeysFilePath }] };
    expect(actual).toStrictEqual(expect.objectContaining(expected));
  });

  it('should enable the "identical-placeholders" rule and set the given filePath when the identicalPlaceholdersFilePath is set', () => {
    const identicalPlaceholdersFilePath = '<path>';
    const actual = i18nJson({ identicalPlaceholdersFilePath }).rules;
    const expected = { 'i18n-json/identical-placeholders': ['error', { filePath: identicalPlaceholdersFilePath }] };
    expect(actual).toStrictEqual(expect.objectContaining(expected));
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
