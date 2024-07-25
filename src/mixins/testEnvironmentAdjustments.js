/** @import { Linter } from 'eslint' */

/**
 * Adjustments to rules for testing environments.
 *
 * This is imported by configs which are meant to be targeted to files containing test code.
 * @satisfies {Linter.Config['rules']}
 */
export const testEnvironmentAdjustments = /** @type {const} */ ({
  '@typescript-eslint/consistent-type-assertions': [
    'error',
    { assertionStyle: 'as', objectLiteralTypeAssertions: 'allow' },
  ],
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-magic-numbers': 'off',
  '@typescript-eslint/no-non-null-assertion': 'off',
});
