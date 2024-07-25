import chaiFriendlyPlugin from 'eslint-plugin-chai-friendly';
import chaiExpectPlugin from 'eslint-plugin-chai-expect';
import typescriptEsLint from 'typescript-eslint';
import { Linter } from 'eslint';
import { chai } from './chai.js';
import { configSchema } from '../__test__/utils/configSchema.js';
import { difference, intersection } from '../__test__/utils/sets.js';
import { files } from '../utils/index.js';
import { configNamePrefix, prefixes } from '../constants.js';
import { getDeprecatedRules, getEnabledRules, getWarnRules, listRules } from '../__test__/utils/rules.js';

describe(chai.name, () => {
  const config = chai();

  const validRules = [
    ...new Linter().getRules().keys(),
    ...listRules(chaiFriendlyPlugin.rules, prefixes.chaiFriendly),
    ...listRules(chaiExpectPlugin.rules, prefixes.chaiExpect),
    ...listRules(typescriptEsLint.plugin.rules as any, prefixes.typescriptEsLint),
  ];
  const deprecatedRules = [
    ...getDeprecatedRules(new Linter().getRules()),
    ...getDeprecatedRules(chaiFriendlyPlugin.rules, prefixes.chaiFriendly),
    ...getDeprecatedRules(chaiExpectPlugin.rules, prefixes.chaiExpect),
    ...getDeprecatedRules(typescriptEsLint.plugin.rules as any, prefixes.typescriptEsLint),
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
    expect(config.name).toBe(`${configNamePrefix}/${chai.name}`);
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
