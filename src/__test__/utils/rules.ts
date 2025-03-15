import { Linter, Rule } from 'eslint';
import { isOff, isWarn } from '../../utils/index.js';

/**
 * Extract a list of rule names that are 'enabled' i.e. set to 'warn' or 'error'
 * @param rules
 */
export function getEnabledRules(rules: Partial<Record<string, Linter.RuleEntry>> = {}): string[] {
  return Object.entries(rules)
    .filter(([, entry]) => entry && !isOff(entry))
    .map(([name]) => name);
}

/**
 * Extract a list of rule names that are set to 'warn'
 * @param rules
 */
export function getWarnRules(rules: Partial<Record<string, Linter.RuleEntry>> = {}): string[] {
  return Object.entries(rules)
    .filter(([, entry]) => entry && isWarn(entry))
    .map(([name]) => name);
}

/**
 * Extract a list of all the rule names with the given prefix prepended to them
 * @param rules
 * @param prefix
 * @param shouldSort
 */
export function listRules(
  rules:
    | Record<string, Linter.RuleEntry | Rule.RuleModule>
    | Map<string, Linter.RuleEntry | Rule.RuleModule>
    | undefined,
  prefix?: string,
  shouldSort: boolean = false,
): string[] {
  const keys = rules instanceof Map ? [...rules.keys()] : Object.keys(rules ?? {});
  const names = keys.map((x) => `${prefix ? `${prefix}/` : ''}${x}`);
  return shouldSort ? names.sort((a, b) => a.localeCompare(b)) : names;
}

/**
 * Extract a list of rule names that are deprecated and, if provided, prepend the prefix to the rule name
 * @param rules
 * @param prefix
 */
export function getDeprecatedRules(
  rules: Record<string, Rule.RuleModule> | Map<string, Rule.RuleModule> | undefined,
  prefix: string = '',
): string[] {
  const entries = rules instanceof Map ? [...rules.entries()] : Object.entries(rules ?? {});
  return entries.filter(([, rule]) => rule.meta?.deprecated).map(([name]) => `${prefix ? `${prefix}/` : ''}${name}`);
}

interface Docs extends NonNullable<Rule.RuleMetaData['docs']> {
  requiresTypeChecking?: boolean;
}

/**
 * Extract a list of rule names that require type information, if provided, prepend the prefix to the rule name
 * @param rules
 * @param prefix
 */
export function getTypeInfoRequiredRules(
  rules: Record<string, Rule.RuleModule> | Map<string, Rule.RuleModule> | undefined,
  prefix: string = '',
): string[] {
  const entries = rules instanceof Map ? [...rules.entries()] : Object.entries(rules ?? {});
  return (
    entries
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      .filter(([, rule]) => (rule.meta?.docs as Docs).requiresTypeChecking)
      .map(([name]) => `${prefix ? `${prefix}/` : ''}${name}`)
  );
}
