import typescriptEsLint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import securityPlugin from 'eslint-plugin-security';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import typescriptEnumPlugin from 'eslint-plugin-typescript-enum';
import unicornPlugin from 'eslint-plugin-unicorn';
import { configSchema } from './__test__/utils/configSchema.js';
import { difference, intersection } from './__test__/utils/sets.js';
import { files } from './utils/index.js';
import { configNamePrefix, prefixes } from './constants.js';
import {
  getDeprecatedRules,
  getEnabledRules,
  getTypeInfoRequiredRules,
  getWarnRules,
  listRules,
} from './__test__/utils/rules.js';
import { buildConfig } from './buildConfig.js';
import { Linter } from 'eslint';

const stylisticPlugin = stylistic as unknown as (typeof stylistic)['default'];

describe(buildConfig.name, () => {
  const configs = buildConfig();

  const expectedFilesGeneral = [files.jsTs];

  const testTable = [
    { id: 'base/eslint/recommended', expectedFiles: expectedFilesGeneral },
    { id: 'base/typescript-eslint/base', expectedFiles: expectedFilesGeneral },
    { id: 'base/typescript-eslint/eslint-recommended', expectedFiles: expectedFilesGeneral },
    { id: 'base/typescript-eslint/recommended', expectedFiles: expectedFilesGeneral },
    { id: 'base', expectedFiles: expectedFilesGeneral },
    { id: 'base/commonJs', expectedFiles: [files.cjs] },
  ] as const;

  const validRules = [
    ...new Linter().getRules().keys(),
    ...listRules(typescriptEsLint.plugin.rules as any, prefixes.typescriptEsLint),
    ...listRules(stylisticPlugin.rules as any, prefixes.stylistic),
    ...listRules(importPlugin.rules, prefixes.import),
    ...listRules(securityPlugin.rules, prefixes.security),
    ...listRules(unusedImportsPlugin.rules, prefixes.unusedImports),
    ...listRules(typescriptEnumPlugin.rules, prefixes.typescriptEnum),
    ...listRules(unicornPlugin.rules, prefixes.unicorn),
  ];
  const deprecatedRules = [
    ...getDeprecatedRules(new Linter().getRules()),
    ...getDeprecatedRules(typescriptEsLint.plugin.rules as any, prefixes.typescriptEsLint),
    ...getDeprecatedRules(importPlugin.rules, prefixes.import),
    ...getDeprecatedRules(securityPlugin.rules, prefixes.security),
    ...getDeprecatedRules(unusedImportsPlugin.rules, prefixes.unusedImports),
    ...getDeprecatedRules(typescriptEnumPlugin.rules, prefixes.typescriptEnum),
  ];
  const typeInfoRequiredRules = getTypeInfoRequiredRules(
    typescriptEsLint.plugin.rules as any,
    prefixes.typescriptEsLint,
  );

  it('should test all the returned configs', () => {
    expect(testTable).toHaveLength(configs.length);
  });

  describe.each(testTable)('$id', (item) => {
    const { id, expectedFiles } = item;
    const index = testTable.indexOf(item);
    const config = configs[index];

    it('should create a valid eslint config', () => {
      const actual = () => configSchema.parse(config);
      expect(actual).not.toThrow();
    });

    it('should configure the expected rules', () => {
      expect(config.rules).toMatchSnapshot();
    });

    it('should set the name value', () => {
      expect(config.name).toBe(`${configNamePrefix}/${id}`);
    });

    it('should set the default files value', () => {
      expect(config.files).toStrictEqual(expectedFiles);
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

    it('should not configure rules that require type information', () => {
      const configuredTsEsLintRules = Object.keys(config.rules ?? {}).filter((x) =>
        x.startsWith(prefixes.typescriptEsLint),
      );
      const actual = intersection(configuredTsEsLintRules, typeInfoRequiredRules);
      expect(actual).toStrictEqual([]);
    });
  });
});
