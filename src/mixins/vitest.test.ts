import vitestPlugin from 'eslint-plugin-vitest';
import typescriptEsLint from 'typescript-eslint';
import securityPlugin from 'eslint-plugin-security';
import { vitest } from './vitest.js';
import { configSchema } from '../__test__/utils/configSchema.js';
import { difference, intersection } from '../__test__/utils/sets.js';
import { files } from '../utils/index.js';
import { configNamePrefix, prefixes } from '../constants.js';
import { getDeprecatedRules, getEnabledRules, getWarnRules, listRules } from '../__test__/utils/rules.js';

describe(vitest.name, () => {
  const config = vitest();

  const validRules = [
    ...listRules(vitestPlugin.rules, prefixes.vitest),
    ...listRules(securityPlugin.rules, prefixes.security),
    ...listRules(typescriptEsLint.plugin.rules as any, prefixes.typescriptEsLint),
  ];
  const deprecatedRules = [
    ...getDeprecatedRules(vitestPlugin.rules, prefixes.vitest),
    ...getDeprecatedRules(securityPlugin.rules, prefixes.security),
    ...getDeprecatedRules(typescriptEsLint.plugin.rules as any, prefixes.typescriptEsLint),
  ];

  it('should create a valid eslint config', () => {
    const actual = () => configSchema.parse(config);
    expect(actual).not.toThrow();
  });

  it('should add the expected plugins to the config', () => {
    const actual = Object.keys(config.plugins ?? {}).sort();
    const expected = [prefixes.vitest].sort();
    expect(actual).toStrictEqual(expected);
  });

  it('should configure the expected rules', () => {
    expect(config.rules).toMatchSnapshot();
  });

  it('should set the name value', () => {
    expect(config.name).toBe(`${configNamePrefix}/${vitest.name}`);
  });

  it('should set the default files value', () => {
    const actual = config.files;
    const expected = [files.testSpec];
    expect(actual).toStrictEqual(expected);
  });

  it('should set the globals to the vitest values', () => {
    const actual = config.languageOptions?.globals;
    const expected = vitestPlugin.environments.env.globals;
    expect(actual).toStrictEqual(expected);
  });

  it('should set the vitest.typecheck setting to "true"', () => {
    const actual = (config.settings as any)?.vitest?.typecheck;
    const expected = true;
    expect(actual).toStrictEqual(expected);
  });

  it('should set the given files value', () => {
    const filesValue = ['files.txt'];
    const actual = vitest({ files: filesValue }).files;
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
