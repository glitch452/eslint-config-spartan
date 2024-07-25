/**
 * Various glob patterns for matching files to be linted.
 *
 * **Glob Notes**:
 * - `*` - Match everything except slashes
 * - `**` - Recursively matches zero or more directories that fall under the current directory
 * - `?` - Wildcard commonly used to match any single character
 * - `[a]` - Character class, match a single character with the options in the `[]`
 * - `[A-Za-z0-9]` - Character class, match a single character from the range
 * - `[!a]` - Negated character class
 * - `\` - Escape characters '?', '*', and '['
 * - `{}` - Group conditions (for example `{*.html,*.txt}`)
 * - `?(pattern-list)` - Matches zero or one occurrence of the given patterns
 * - `*(pattern-list)` - Matches zero or more occurrences of the given patterns
 * - `+(pattern-list)` - Matches one or more occurrences of the given patterns
 * - `@(pattern-list)` - Matches one of the given patterns
 * - `!(pattern-list)` - Matches anything except one of the given patterns
 *
 * See <https://www.gnu.org/software/bash/manual/html_node/Pattern-Matching.html> for more information.
 * @satisfies {Record<string, string>}
 */
export const files = /** @type {const} */ ({
  cjs: '**/*.cjs?(x)',
  cypress: '**/*.cy.?(c|m)[jt]s',
  js: '**/*.?(c|m)js?(x)',
  json: '**/*.json',
  jsTs: '**/*.?(c|m)[jt]s?(x)',
  jsTsNoX: '**/*.?(c|m)[jt]s',
  jsxTsx: '**/*.?(c|m)[jt]sx',
  md: '**/*.{md,markdown}',
  mdMdx: '**/*.{md?(x),markdown}',
  mdx: '**/*.mdx',
  spec: '**/?(*.)spec.?(c|m)[jt]s?(x)',
  stories: '**/?(*.){story,stories}.?(c|m)[jt]s?(x)',
  storybookMain: '**/.storybook/main.?(c|m)[jt]s?(x)',
  test: '**/?(*.)test.?(c|m)[jt]s?(x)',
  testSpec: '**/?(*.){spec,test}.?(c|m)[jt]s?(x)',
  ts: '**/*.?(c|m)ts?(x)',
});
