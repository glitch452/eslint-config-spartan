import { prettier } from './prettier.js';
import { configSchema } from '../__test__/utils/configSchema.js';
import { intersection } from '../__test__/utils/sets.js';
import { CONFIG_NAME_PREFIX } from '../constants.js';
import { getEnabledRules } from '../__test__/utils/rules.js';

describe(prettier.name, () => {
  const config = prettier();

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

  it('should set the name value', () => {
    expect(config.name).toBe(`${CONFIG_NAME_PREFIX}/${prettier.name}`);
  });

  it('should set the default files value', () => {
    const actual = config.files;
    const expected = undefined;
    expect(actual).toStrictEqual(expected);
  });

  it('should set the given files value', () => {
    const filesValue = ['files.txt'];
    const actual = prettier({ files: filesValue }).files;
    expect(actual).toStrictEqual(filesValue);
  });

  it('should not configure rules that are removed from the export', () => {
    const rules = Object.keys(config.rules ?? {});
    const removedRules = ['curly'];
    const actual = intersection(rules, removedRules);
    expect(actual).toStrictEqual([]);
  });

  it('should not enable any rules', () => {
    const enabledRules = getEnabledRules(config.rules);
    expect(enabledRules).toStrictEqual([]);
  });
});
