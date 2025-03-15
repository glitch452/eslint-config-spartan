import jSDocPlugin from 'eslint-plugin-jsdoc';
import { jsDoc } from './jsDoc.js';
import { configSchema } from '../__test__/utils/configSchema.js';
import { difference, intersection } from '../__test__/utils/sets.js';
import { files } from '../utils/index.js';
import { CONFIG_NAME_PREFIX, prefixes } from '../constants.js';
import { getDeprecatedRules, getEnabledRules, getWarnRules, listRules } from '../__test__/utils/rules.js';

describe(jsDoc.name, () => {
  const configs = jsDoc();
  const testTable = [
    { id: 'Ts', filesOption: 'filesTs', expectedFiles: [files.ts], plugins: [] },
    { id: 'Js', filesOption: 'filesJs', expectedFiles: [files.js], plugins: [] },
    { id: 'JsTs', filesOption: 'filesBoth', expectedFiles: [files.jsTs], plugins: [prefixes.jsDoc] },
  ] as const;

  const validRules = listRules(jSDocPlugin.rules, prefixes.jsDoc);
  const deprecatedRules = getDeprecatedRules(jSDocPlugin.rules, prefixes.jsDoc);

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
      expect(config.name).toBe(`${CONFIG_NAME_PREFIX}/${jsDoc.name}/${id}`);
    });

    it('should set the default files value', () => {
      expect(config.files).toStrictEqual(expectedFiles);
    });

    it('should set the given files value', () => {
      const fileValue = ['files.txt'];
      const actual = jsDoc({ [filesOption]: fileValue })[index].files;
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
