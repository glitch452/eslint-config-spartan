import { googleAppsScript } from './googleAppsScript.js';
import { configSchema } from '../__test__/utils/configSchema.js';
import { files } from '../utils/index.js';
import { CONFIG_NAME_PREFIX } from '../constants.js';

describe(googleAppsScript.name, () => {
  const config = googleAppsScript();

  it('should create a valid eslint config', () => {
    const actual = () => configSchema.parse(config);
    expect(actual).not.toThrow();
  });

  it('should configure the expected languageOptions', () => {
    expect(config.languageOptions).toMatchSnapshot();
  });

  it('should set the name value', () => {
    expect(config.name).toBe(`${CONFIG_NAME_PREFIX}/${googleAppsScript.name}`);
  });

  it('should set the default files value', () => {
    const actual = config.files;
    const expected = [files.jsTs];
    expect(actual).toStrictEqual(expected);
  });

  it('should set the given files value', () => {
    const fileValue = ['files.txt'];
    const actual = googleAppsScript({ files: fileValue }).files;
    expect(actual).toStrictEqual(fileValue);
  });

  it('should not configure any rules', () => {
    expect(config.rules).toBeUndefined();
  });
});
