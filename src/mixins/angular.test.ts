import angularPlugin from '@angular-eslint/eslint-plugin';
import angularTemplatePlugin from '@angular-eslint/eslint-plugin-template';
import { angular } from './angular.js';
import { configSchema } from '../__test__/utils/configSchema.js';
import { difference, intersection } from '../__test__/utils/sets.js';
import { files } from '../utils/index.js';
import { CONFIG_NAME_PREFIX, prefixes } from '../constants.js';
import { getDeprecatedRules, getEnabledRules, getWarnRules, listRules } from '../__test__/utils/rules.js';

describe(angular.name, () => {
  const configs = angular();
  const testTable = [
    {
      id: 'angular',
      filesOption: 'files',
      expectedFiles: [files.jsTs],
      plugins: [prefixes.angular, prefixes.angularTemplate],
    },
    {
      id: 'angularTemplate',
      filesOption: 'templateFiles',
      expectedFiles: [files.html],
      plugins: [prefixes.angularTemplate],
    },
  ] as const;

  const validRules = [
    ...listRules(angularPlugin.rules, prefixes.angular),
    ...listRules(angularTemplatePlugin.rules, prefixes.angularTemplate),
  ];
  const deprecatedRules = [
    ...getDeprecatedRules(angularPlugin.rules, prefixes.angular),
    ...getDeprecatedRules(angularTemplatePlugin.rules, prefixes.angularTemplate),
  ];

  it('should test all the returned configs', () => {
    expect(testTable).toHaveLength(configs.length);
  });

  describe.each(testTable)('$id', (item) => {
    const { id, expectedFiles, filesOption, plugins } = item;
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
      expect(config.name).toBe(`${CONFIG_NAME_PREFIX}/${id}`);
    });

    it('should set the default files value', () => {
      expect(config.files).toStrictEqual(expectedFiles);
    });

    it('should set the given files value', () => {
      const fileValue = ['files.txt'];
      const actual = angular({ [filesOption]: fileValue })[index].files;
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
