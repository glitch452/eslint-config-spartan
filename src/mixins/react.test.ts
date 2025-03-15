import reactPlugin from 'eslint-plugin-react';
import * as reactHooksPlugin from 'eslint-plugin-react-hooks';
import { react } from './react.js';
import { configSchema } from '../__test__/utils/configSchema.js';
import { difference, intersection } from '../__test__/utils/sets.js';
import { files } from '../utils/index.js';
import { CONFIG_NAME_PREFIX, prefixes } from '../constants.js';
import { getDeprecatedRules, getEnabledRules, getWarnRules, listRules } from '../__test__/utils/rules.js';
import globals from 'globals';

describe(react.name, () => {
  const config = react();

  const validRules = [
    ...listRules(reactPlugin.rules, prefixes.react),
    ...listRules(reactHooksPlugin.rules, prefixes.reactHooks),
  ];
  const deprecatedRules = [
    ...getDeprecatedRules(reactPlugin.rules, prefixes.react),
    ...getDeprecatedRules(reactHooksPlugin.rules, prefixes.reactHooks),
  ];

  it('should create a valid eslint config', () => {
    const actual = () => configSchema.parse(config);
    expect(actual).not.toThrow();
  });

  it('should add the expected plugins to the config', () => {
    const actual = Object.keys(config.plugins ?? {}).sort();
    const expected = [prefixes.react, prefixes.reactHooks].sort();
    expect(actual).toStrictEqual(expected);
  });

  it('should configure the expected rules when "noJsxRuntime" is not set', () => {
    expect(config.rules).toMatchSnapshot();
  });

  it('should configure the expected rules when "noJsxRuntime" is true', () => {
    const actual = react({ noJsxRuntime: true });
    expect(actual.rules).toMatchSnapshot();
  });

  it('should set the name value', () => {
    expect(config.name).toBe(`${CONFIG_NAME_PREFIX}/${react.name}`);
  });

  it('should set the default files value', () => {
    const actual = config.files;
    const expected = [files.jsTs];
    expect(actual).toStrictEqual(expected);
  });

  it('should set the given files value', () => {
    const fileValue = ['files.txt'];
    const actual = react({ files: fileValue }).files;
    expect(actual).toStrictEqual(fileValue);
  });

  it('should set the globals to the browser values', () => {
    const actual = config.languageOptions?.globals;
    const expected = globals.browser;
    expect(actual).toStrictEqual(expected);
  });

  it('should set the react.version setting to "detect"', () => {
    const actual = (config.settings as any)?.react?.version;
    const expected = 'detect';
    expect(actual).toStrictEqual(expected);
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
