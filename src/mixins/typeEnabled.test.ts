import typescriptEsLint from 'typescript-eslint';
import { typeEnabled } from './typeEnabled.js';
import { configSchema } from '../__test__/utils/configSchema.js';
import { difference, intersection } from '../__test__/utils/sets.js';
import { files } from '../utils/index.js';
import { CONFIG_NAME_PREFIX, prefixes } from '../constants.js';
import {
  getDeprecatedRules,
  getEnabledRules,
  getTypeInfoRequiredRules,
  getWarnRules,
  listRules,
} from '../__test__/utils/rules.js';
import { Linter } from 'eslint';

describe(typeEnabled.name, () => {
  const config = typeEnabled();

  const validRules = [
    ...new Linter({ configType: 'eslintrc' }).getRules().keys(),
    ...listRules((typescriptEsLint.plugin as any).rules, prefixes.typescriptEsLint),
  ];
  const deprecatedRules = [
    ...getDeprecatedRules(new Linter({ configType: 'eslintrc' }).getRules()),
    ...getDeprecatedRules((typescriptEsLint.plugin as any).rules, prefixes.typescriptEsLint),
  ];
  const typeInfoRequiredRules = getTypeInfoRequiredRules(
    (typescriptEsLint.plugin as any).rules,
    prefixes.typescriptEsLint,
  );

  it('should create a valid eslint config', () => {
    const actual = () => configSchema.parse(config);
    expect(actual).not.toThrow();
  });

  it('should add the expected plugins to the config', () => {
    const actual = Object.keys(config.plugins ?? {}).sort();
    const expected = [].sort();
    expect(actual).toStrictEqual(expected);
  });

  it('should configure the expected rules', () => {
    expect(config.rules).toMatchSnapshot();
  });

  it('should track the list of type information required rules', () => {
    expect(typeInfoRequiredRules).toMatchSnapshot();
  });

  it('should set the name value', () => {
    expect(config.name).toBe(`${CONFIG_NAME_PREFIX}/${typeEnabled.name}`);
  });

  it('should set the default files value', () => {
    const actual = config.files;
    const expected = [files.jsTs];
    expect(actual).toStrictEqual(expected);
  });

  it('should set the given files value', () => {
    const filesValue = ['files.txt'];
    const actual = typeEnabled({ files: filesValue }).files;
    expect(actual).toStrictEqual(filesValue);
  });

  it('should set the default ignores value', () => {
    const actual = config.ignores;
    const expected = [`${files.mdMdx}/**/*`];
    expect(actual).toStrictEqual(expected);
  });

  it('should set the given ignores value', () => {
    const ignoresValue = ['ignores.txt'];
    const actual = typeEnabled({ ignores: ignoresValue }).ignores;
    expect(actual).toStrictEqual(ignoresValue);
  });

  it('should set the given parserOptions value', () => {
    const options = { parserOptions: { ecmaVersion: 'latest' } } as const;
    const actual = typeEnabled(options).languageOptions;
    expect(actual).toStrictEqual(options);
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

  it('should only configure rules that require type information', () => {
    const configuredTsEsLintRules = Object.keys(config.rules ?? {}).filter((x) =>
      x.startsWith(prefixes.typescriptEsLint),
    );
    const actual = difference(configuredTsEsLintRules, typeInfoRequiredRules);
    expect(actual).toStrictEqual([]);
  });
});
