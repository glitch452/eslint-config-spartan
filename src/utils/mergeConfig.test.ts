import { Linter } from 'eslint';
import { mergeConfig } from './mergeConfig.js';

describe(mergeConfig.name, () => {
  const config1: Linter.Config = { name: '1' };
  const config2: Linter.Config = { name: '2' };
  const config3: Linter.Config = { name: '3' };
  const config4: Linter.Config = { name: '4' };

  it('should return an empty array when given no inputs', () => {
    const actual = mergeConfig();
    const expected: unknown[] = [];
    expect(actual).toStrictEqual(expected);
  });

  it('should return an array with one item when given a single config entry', () => {
    const actual = mergeConfig(config1);
    const expected = [config1];
    expect(actual).toStrictEqual(expected);
  });

  it('should return an array with two items when given two config entries', () => {
    const actual = mergeConfig(config1, config1);
    const expected = [config1, config1];
    expect(actual).toStrictEqual(expected);
  });

  it('should return a flattened array when given a nested config', () => {
    const actual = mergeConfig(config1, [config1]);
    const expected = [config1, config1];
    expect(actual).toStrictEqual(expected);
  });

  it('should return a flattened array when given a nested config with a doubly nested config', () => {
    const actual = mergeConfig(config1, [config1, [config1]]);
    const expected = [config1, config1, config1];
    expect(actual).toStrictEqual(expected);
  });

  it('should return a flattened array when given a nested config which contains a nested config', () => {
    const actual = mergeConfig(config1, [[config1]]);
    const expected = [config1, config1];
    expect(actual).toStrictEqual(expected);
  });

  it('should return a single config when a function is given', () => {
    const actual = mergeConfig(() => config1);
    const expected = [config1];
    expect(actual).toStrictEqual(expected);
  });

  it('should return a flattened array when a function that returns one config is given', () => {
    const actual = mergeConfig(() => config1);
    const expected = [config1];
    expect(actual).toStrictEqual(expected);
  });

  it('should return a flattened array when a function that returns two configs is given', () => {
    const actual = mergeConfig(() => [config1, config1]);
    const expected = [config1, config1];
    expect(actual).toStrictEqual(expected);
  });

  it('should return a flattened array when a function that returns two configs is given with a single config and a nested config', () => {
    const actual = mergeConfig(config1, [config1], () => [config1, config1]);
    const expected = [config1, config1, config1, config1];
    expect(actual).toStrictEqual(expected);
  });

  it('should return a flattened array when a function that returns two configs is nested', () => {
    const actual = mergeConfig([() => [config1, config1]]);
    const expected = [config1, config1];
    expect(actual).toStrictEqual(expected);
  });

  it('should return a flattened array when a function that returns two configs is nested deeply', () => {
    const actual = mergeConfig([[[[() => [config1, config2]]]]]);
    const expected = [config1, config2];
    expect(actual).toStrictEqual(expected);
  });

  it('should return a flattened array in the correct order when a function that returns two configs is given with a single config and a nested config', () => {
    const actual = mergeConfig(config1, [config2], () => [config3, config4]);
    const expected = [config1, config2, config3, config4];
    expect(actual).toStrictEqual(expected);
  });
});
