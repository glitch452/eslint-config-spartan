import regExpPlugin from 'eslint-plugin-regexp';
import { regExp } from './regExp.js';
import { configSchema } from '../__test__/utils/configSchema.js';
import { difference, intersection } from '../__test__/utils/sets.js';
import { files } from '../utils/index.js';
import { CONFIG_NAME_PREFIX, prefixes } from '../constants.js';
import { getDeprecatedRules, getEnabledRules, getWarnRules, listRules } from '../__test__/utils/rules.js';
import { Linter } from 'eslint';

describe(regExp.name, () => {
  const config = regExp();

  const validRules = [
    ...new Linter({ configType: 'eslintrc' }).getRules().keys(),
    ...listRules(regExpPlugin.rules, prefixes.regExp),
  ];
  const deprecatedRules = [
    ...getDeprecatedRules(new Linter({ configType: 'eslintrc' }).getRules()),
    ...getDeprecatedRules(regExpPlugin.rules, prefixes.regExp),
  ];

  it('should create a valid eslint config', () => {
    const actual = () => configSchema.parse(config);
    expect(actual).not.toThrow();
  });

  it('should add the expected plugins to the config', () => {
    const actual = Object.keys(config.plugins ?? {}).sort();
    const expected = [prefixes.regExp].sort();
    expect(actual).toStrictEqual(expected);
  });

  it('should configure the expected rules', () => {
    expect(config.rules).toMatchSnapshot();
  });

  it('should set the name value', () => {
    expect(config.name).toBe(`${CONFIG_NAME_PREFIX}/${regExp.name}`);
  });

  it('should set the default files value', () => {
    const actual = config.files;
    const expected = [files.jsTs];
    expect(actual).toStrictEqual(expected);
  });

  it('should set the given files value', () => {
    const fileValue = ['files.txt'];
    const actual = regExp({ files: fileValue }).files;
    expect(actual).toStrictEqual(fileValue);
  });

  it('should set the given settings value', () => {
    const settings = { tailwindcss: { config: 'tailwind.config.js' } };
    const actual = regExp({ settings }).settings;
    expect(actual).toStrictEqual(settings);
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
