import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import { jsxA11y } from './jsxA11y.js';
import { configSchema } from '../__test__/utils/configSchema.js';
import { difference, intersection } from '../__test__/utils/sets.js';
import { files } from '../utils/index.js';
import { configNamePrefix, prefixes } from '../constants.js';
import { getDeprecatedRules, getEnabledRules, getWarnRules, listRules } from '../__test__/utils/rules.js';

describe(jsxA11y.name, () => {
  const config = jsxA11y();

  const validRules = listRules(jsxA11yPlugin.rules, prefixes.jsxA11y);
  const deprecatedRules = getDeprecatedRules(jsxA11yPlugin.rules, prefixes.jsxA11y);

  it('should create a valid eslint config', () => {
    const actual = () => configSchema.parse(config);
    expect(actual).not.toThrow();
  });

  it.each([prefixes.jsxA11y])('should add the "%s" plugin to the config', (prefix) => {
    const actual = config.plugins?.[prefix];
    expect(actual).toBeDefined();
  });

  it('should add the expected plugins to the config', () => {
    const actual = Object.keys(config.plugins ?? {}).sort();
    const expected = [prefixes.jsxA11y].sort();
    expect(actual).toStrictEqual(expected);
  });

  it('should configure the expected rules', () => {
    expect(config.rules).toMatchSnapshot();
  });

  it('should set the name value', () => {
    expect(config.name).toBe(`${configNamePrefix}/${jsxA11y.name}`);
  });

  it('should set the default files value', () => {
    const actual = config.files;
    const expected = [files.jsxTsx];
    expect(actual).toStrictEqual(expected);
  });

  it('should set the given files value', () => {
    const filesValue = ['files.txt'];
    const actual = jsxA11y({ files: filesValue }).files;
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
