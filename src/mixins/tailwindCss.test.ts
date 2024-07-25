import tailwindCssPlugin from 'eslint-plugin-tailwindcss';
import { tailwindCss } from './tailwindCss.js';
import { configSchema } from '../__test__/utils/configSchema.js';
import { difference, intersection } from '../__test__/utils/sets.js';
import { files } from '../utils/index.js';
import { configNamePrefix, prefixes } from '../constants.js';
import { getDeprecatedRules, getEnabledRules, getWarnRules, listRules } from '../__test__/utils/rules.js';

describe(tailwindCss.name, () => {
  const config = tailwindCss();

  const validRules = listRules(tailwindCssPlugin.rules, prefixes.tailwindCss);
  const deprecatedRules = getDeprecatedRules(tailwindCssPlugin.rules, prefixes.tailwindCss);

  it('should fail if the number of plugin configs changes', () => {
    const actual = tailwindCssPlugin.configs['flat/recommended'].length;
    const expected = 2;
    expect(actual).toBe(expected);
  });

  it('should create a valid eslint config', () => {
    const actual = () => configSchema.parse(config);
    expect(actual).not.toThrow();
  });

  it('should add the expected plugins to the config', () => {
    const actual = Object.keys(config.plugins ?? {}).sort();
    const expected = [prefixes.tailwindCss].sort();
    expect(actual).toStrictEqual(expected);
  });

  it('should configure the expected rules', () => {
    expect(config.rules).toMatchSnapshot();
  });

  it('should set the name value', () => {
    expect(config.name).toBe(`${configNamePrefix}/${tailwindCss.name}`);
  });

  it('should set the default files value', () => {
    const actual = config.files;
    const expected = [files.jsxTsx];
    expect(actual).toStrictEqual(expected);
  });

  it('should set the given files value', () => {
    const fileValue = ['files.txt'];
    const actual = tailwindCss({ files: fileValue }).files;
    expect(actual).toStrictEqual(fileValue);
  });

  it('should set the given settings value', () => {
    const settings = { tailwindcss: { config: 'tailwind.config.js' } };
    const actual = tailwindCss({ settings }).settings;
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
