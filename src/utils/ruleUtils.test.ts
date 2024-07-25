import { Linter } from 'eslint';
import { isError, isOff, isWarn, setSeverity, warnToError } from './ruleUtils.js';

describe('ruleUtils', () => {
  const offEntries: Linter.RuleEntry[] = [0, 'off', [0], ['off']];
  const warnEntries: Linter.RuleEntry[] = [1, 'warn', [1], ['warn']];
  const errorEntries: Linter.RuleEntry[] = [2, 'error', [2], ['error']];

  describe(warnToError.name, () => {
    it('should return an empty rule set if no rules are provided', () => {
      const actual = warnToError();
      const expected = {};
      expect(actual).toStrictEqual(expected);
    });

    it('should return the rules unchanged if none are errors', () => {
      const rules: Linter.RulesRecord = {
        rule1: 0,
        rule2: 'off',
        rule3: 2,
        rule4: 'error',
        rule5: [0],
        rule6: ['off'],
        rule7: [2],
        rule8: ['error'],
      };
      const actual = warnToError(rules);
      const expected = rules;
      expect(actual).toStrictEqual(expected);
    });

    it('should return the rules converted to error if they are warn', () => {
      const rules: Linter.RulesRecord = { rule1: 1, rule2: 'warn', rule3: [1], rule4: ['warn'] };
      const actual = warnToError(rules);
      const expected: Linter.RulesRecord = { rule1: 'error', rule2: 'error', rule3: ['error'], rule4: ['error'] };
      expect(actual).toStrictEqual(expected);
    });
  });

  describe(isOff.name, () => {
    it.each(offEntries)('should return true when the configuration is off (%s)', (entry) => {
      const actual = isOff(entry);
      const expected = true;
      expect(actual).toStrictEqual(expected);
    });

    it.each(warnEntries)('should return false when the configuration is warn (%s)', (entry) => {
      const actual = isOff(entry);
      const expected = false;
      expect(actual).toStrictEqual(expected);
    });

    it.each(errorEntries)('should return false when the configuration is error (%s)', (entry) => {
      const actual = isOff(entry);
      const expected = false;
      expect(actual).toStrictEqual(expected);
    });
  });

  describe(isWarn.name, () => {
    it.each(offEntries)('should return false when the configuration is off (%s)', (entry) => {
      const actual = isWarn(entry);
      const expected = false;
      expect(actual).toStrictEqual(expected);
    });

    it.each(warnEntries)('should return true when the configuration is warn (%s)', (entry) => {
      const actual = isWarn(entry);
      const expected = true;
      expect(actual).toStrictEqual(expected);
    });

    it.each(errorEntries)('should return false when the configuration is error (%s)', (entry) => {
      const actual = isWarn(entry);
      const expected = false;
      expect(actual).toStrictEqual(expected);
    });
  });

  describe(isError.name, () => {
    it.each(offEntries)('should return false when the configuration is off (%s)', (entry) => {
      const actual = isError(entry);
      const expected = false;
      expect(actual).toStrictEqual(expected);
    });

    it.each(warnEntries)('should return false when the configuration is warn (%s)', (entry) => {
      const actual = isError(entry);
      const expected = false;
      expect(actual).toStrictEqual(expected);
    });

    it.each(errorEntries)('should return true when the configuration is error (%s)', (entry) => {
      const actual = isError(entry);
      const expected = true;
      expect(actual).toStrictEqual(expected);
    });
  });

  describe(setSeverity.name, () => {
    const allEntries = [...offEntries, ...warnEntries, ...errorEntries];

    it.each(allEntries)('should set the severity to off (%s)', (entry) => {
      const actual = setSeverity(entry, 'off');
      const expected = Array.isArray(actual) ? ['off'] : 'off';
      expect(actual).toStrictEqual(expected);
    });

    it.each(allEntries)('should set the severity to warn (%s)', (entry) => {
      const actual = setSeverity(entry, 'warn');
      const expected = Array.isArray(actual) ? ['warn'] : 'warn';
      expect(actual).toStrictEqual(expected);
    });

    it.each(allEntries)('should set the severity to error (%s)', (entry) => {
      const actual = setSeverity(entry, 'error');
      const expected = Array.isArray(actual) ? ['error'] : 'error';
      expect(actual).toStrictEqual(expected);
    });

    it('should maintain the options when setting the severity (%s)', () => {
      const actual = setSeverity(['off', { test: 'value' }], 'error');
      const expected = ['error', { test: 'value' }];
      expect(actual).toStrictEqual(expected);
    });
  });
});
