import storybookExport from 'eslint-plugin-storybook';
import * as reactHooksPlugin from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import { storybook } from './storybook.js';
import { configSchema } from '../__test__/utils/configSchema.js';
import { difference, intersection } from '../__test__/utils/sets.js';
import { files } from '../utils/index.js';
import { CONFIG_NAME_PREFIX, prefixes } from '../constants.js';
import { getDeprecatedRules, getEnabledRules, getWarnRules, listRules } from '../__test__/utils/rules.js';
import { Rule } from 'eslint';

const storybookPlugin = storybookExport as unknown as typeof storybookExport.default;

describe(storybook.name, () => {
  const configs = storybook();

  const testTable = configs.map((config, i) => ({
    id: i.toString(),
    expectedFiles: config.name?.endsWith('main-rules') ? files.storybookMain : files.stories,
    filesOverride: ['files.txt'],
    mainFilesOverride: ['mainFiles.txt'],
    expectedFilesOverride: config.name?.endsWith('main-rules') ? ['mainFiles.txt'] : ['files.txt'],
  }));

  const validRules = [
    ...listRules(storybookPlugin.rules as unknown as Record<string, Rule.RuleModule>, prefixes.storybook),
    ...listRules(reactHooksPlugin.rules, prefixes.reactHooks),
    ...listRules(importPlugin.rules, prefixes.import),
  ];
  const deprecatedRules = [
    ...getDeprecatedRules(storybookPlugin.rules as unknown as Record<string, Rule.RuleModule>, prefixes.storybook),
    ...getDeprecatedRules(reactHooksPlugin.rules, prefixes.reactHooks),
    ...getDeprecatedRules(importPlugin.rules, prefixes.import),
  ];

  it('should test all the returned configs', () => {
    expect(testTable).toHaveLength(configs.length);
  });

  describe.each(testTable)('$id', (item) => {
    const { id, expectedFiles, filesOverride, mainFilesOverride, expectedFilesOverride } = item;
    const index = testTable.indexOf(item);
    const config = configs[index];

    it('should create a valid eslint config', () => {
      const actual = () => configSchema.parse(config);
      expect(actual).not.toThrow();
    });

    it('should add the expected plugins to the config', () => {
      const actual = new Set(Object.keys(config.plugins ?? {}));
      const expected = new Set([prefixes.storybook]);
      expect(actual).toStrictEqual(expected);
    });

    it('should configure the expected rules', () => {
      expect(config.rules).toMatchSnapshot();
    });

    it('should set the name value', () => {
      expect(config.name).toContain(`${CONFIG_NAME_PREFIX}/${storybook.name}/${id}`);
    });

    it('should set the default files value', () => {
      const actual = config.files;
      expect(actual).toStrictEqual([expectedFiles]);
    });

    it('should set the given files value', () => {
      const actual = storybook({ files: filesOverride, mainFiles: mainFilesOverride })[index].files;
      expect(actual).toStrictEqual(expectedFilesOverride);
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
