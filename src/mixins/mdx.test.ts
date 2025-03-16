import reactPlugin from 'eslint-plugin-react';
import typescriptEsLint from 'typescript-eslint';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
// Note: Can't import this before unusedImportsPlugin, Error running test suite: Could not find ESLint Linter in require cache
import * as mdxPlugin from 'eslint-plugin-mdx';
import { mdx } from './mdx.js';
import { configSchema } from '../__test__/utils/configSchema.js';
import { difference, intersection } from '../__test__/utils/sets.js';
import { files } from '../utils/index.js';
import { CONFIG_NAME_PREFIX, prefixes } from '../constants.js';
import { getDeprecatedRules, getEnabledRules, getWarnRules, listRules } from '../__test__/utils/rules.js';
import { Linter } from 'eslint';

describe(mdx.name, () => {
  const configs = mdx();
  const testTable = [
    { id: 'base', filesOption: 'files', expectedFiles: [files.mdMdx], plugins: [prefixes.mdx] },
    { id: 'code-blocks', filesOption: 'codeBlocksFiles', expectedFiles: [`${files.mdMdx}/**/*`], plugins: [] },
  ] as const;

  const validRules = [
    ...new Linter({ configType: 'eslintrc' }).getRules().keys(),
    ...listRules(mdxPlugin.rules, prefixes.mdx),
    ...listRules(unusedImportsPlugin.rules, prefixes.unusedImports),
    ...listRules(reactPlugin.rules, prefixes.react),
    ...listRules(typescriptEsLint.plugin.rules as any, prefixes.typescriptEsLint),
  ];
  const deprecatedRules = [
    ...getDeprecatedRules(new Linter({ configType: 'eslintrc' }).getRules()),
    ...getDeprecatedRules(mdxPlugin.rules, prefixes.mdx),
    ...getDeprecatedRules(unusedImportsPlugin.rules, prefixes.unusedImports),
    ...getDeprecatedRules(reactPlugin.rules, prefixes.react),
    ...getDeprecatedRules(typescriptEsLint.plugin.rules as any, prefixes.typescriptEsLint),
  ];

  it('should test all the returned configs', () => {
    expect(testTable).toHaveLength(configs.length);
  });

  describe.each(testTable)('$id', (item) => {
    const { id, filesOption, expectedFiles, plugins } = item;
    const index = testTable.indexOf(item);
    const config = configs[index];

    it('should create a valid eslint config', () => {
      const actual = () => configSchema.parse(config);
      expect(actual).not.toThrow();
    });

    it('should add the expected plugins to the config', () => {
      const actual = Object.keys(config.plugins ?? {}).sort();
      const expected = plugins;
      expect(actual).toStrictEqual(expected);
    });

    it('should configure the expected rules', () => {
      expect(config.rules).toMatchSnapshot();
    });

    it('should set the name value', () => {
      expect(config.name).toBe(`${CONFIG_NAME_PREFIX}/${mdx.name}/${id}`);
    });

    it('should set the default files value', () => {
      const actual = config.files;
      expect(actual).toStrictEqual(expectedFiles);
    });

    it('should set the given files value', () => {
      const fileValue = ['files.txt'];
      const actual = mdx({ [filesOption]: fileValue })[index].files;
      expect(actual).toStrictEqual(fileValue);
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
});
