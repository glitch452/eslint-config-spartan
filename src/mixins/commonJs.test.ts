import typescriptEsLint from 'typescript-eslint';
import unicornPlugin from 'eslint-plugin-unicorn';
import { commonJs } from './commonJs.js';
import { configSchema } from '../__test__/utils/configSchema.js';
import { difference, intersection } from '../__test__/utils/sets.js';
import { files } from '../utils/index.js';
import { configNamePrefix, prefixes } from '../constants.js';
import globals from 'globals';
import { getDeprecatedRules, getEnabledRules, getWarnRules, listRules } from '../__test__/utils/rules.js';

describe(commonJs.name, () => {
  const config = commonJs();

  const validRules = [
    ...listRules(typescriptEsLint.plugin.rules as any, prefixes.typescriptEsLint),
    ...listRules(unicornPlugin.rules, prefixes.unicorn),
  ];
  const deprecatedRules = getDeprecatedRules(typescriptEsLint.plugin.rules as any, prefixes.typescriptEsLint);

  it('should create a valid eslint config', () => {
    const actual = () => configSchema.parse(config);
    expect(actual).not.toThrow();
  });

  it('should configure the expected rules', () => {
    expect(config.rules).toMatchSnapshot();
  });

  it('should set the name value', () => {
    expect(config.name).toBe(`${configNamePrefix}/${commonJs.name}`);
  });

  it('should set the default files value', () => {
    const actual = config.files;
    const expected = [files.cjs];
    expect(actual).toStrictEqual(expected);
  });

  it('should set the given files value', () => {
    const filesValue = ['files.txt'];
    const actual = commonJs({ files: filesValue }).files;
    expect(actual).toStrictEqual(filesValue);
  });

  it('should set the source type to commonjs', () => {
    const actual = config.languageOptions?.sourceType;
    const expected = 'commonjs';
    expect(actual).toStrictEqual(expected);
  });

  it('should set the globals to the node values', () => {
    const actual = config.languageOptions?.globals;
    const expected = globals.node;
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
