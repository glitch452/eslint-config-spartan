/** @import { Linter } from 'eslint' */

/**
 * Converts a rule configuration from a warning to an error, otherwise returns the same configuration.
 * @template {Partial<Linter.RulesRecord>} Rules
 * @param {Readonly<Rules>=} rules
 * @returns {Rules}
 */
export function warnToError(rules) {
  return /** @type {Rules} */ (
    rules
      ? Object.fromEntries(
          Object.entries(rules).map(([rule, entry]) => [rule, isWarn(entry) ? setSeverity(entry, 'error') : entry]),
        )
      : {}
  );
}

/**
 * @param {Linter.RuleEntry} entry
 * @returns {boolean}
 */
export function isOff(entry) {
  const off = 0;
  if (Array.isArray(entry)) {
    return isOff(entry[0]);
  }
  return entry === off || entry === 'off';
}

/**
 * @param {Linter.RuleEntry} entry
 * @returns {boolean}
 */
export function isWarn(entry) {
  const warn = 1;
  if (Array.isArray(entry)) {
    return isWarn(entry[0]);
  }
  return entry === warn || entry === 'warn';
}

/**
 * @param {Linter.RuleEntry} entry
 * @returns {boolean}
 */
export function isError(entry) {
  const error = 2;
  if (Array.isArray(entry)) {
    return isError(entry[0]);
  }
  return entry === error || entry === 'error';
}

/**
 * @template {any[]} Options
 * @param {Readonly<Linter.RuleEntry<Options>>} entry
 * @param {Linter.RuleSeverity} severity
 * @returns {Linter.RuleEntry<Options>}
 */
export function setSeverity(entry, severity) {
  if (Array.isArray(entry)) {
    const options = /** @type {Partial<Options>} */ (entry.slice(1));
    return [severity, ...options];
  }
  return severity;
}
