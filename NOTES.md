# Notes

## Issue Tracking

- eslint-plugin-markdown / eslint-plugin-mdx
  - Unable to support type-enabled rules: <https://github.com/eslint/markdown/blob/main/examples/typescript/README.md>
- @eslint/compat
  - v1.2.x requires eslint v9
- eslint-plugin-cypress
  - v4.x.x requires eslint v9
- eslint-plugin-unicorn
  - v57.x.x requires eslint v9
- @stylistic/eslint-plugin
  - v4.x.x requires eslint v9
- Migrate eslint-plugin-vitest to @vitest/eslint-plugin
  - Requires typescript-eslint ^8.x.x

## Plugins to consider adding

- [eslint-plugin-astro](https://www.npmjs.com/package/eslint-plugin-astro)
  - [astro-eslint-parser](https://www.npmjs.com/package/astro-eslint-parser)
- [eslint-plugin-perfectionist](https://www.npmjs.com/package/eslint-plugin-perfectionist)
- [eslint-plugin-simple-import-sort](https://www.npmjs.com/package/eslint-plugin-simple-import-sort)
- [eslint-plugin-typescript-sort-keys](https://www.npmjs.com/package/eslint-plugin-typescript-sort-keys)
- [eslint-plugin-deprecation](https://www.npmjs.com/package/eslint-plugin-deprecation)
- [eslint-plugin-rxjs](https://www.npmjs.com/package/eslint-plugin-rxjs)
- [eslint-plugin-boundaries](https://www.npmjs.com/package/eslint-plugin-boundaries)
- [eslint-plugin-react-redux](https://www.npmjs.com/package/eslint-plugin-react-redux)
- [eslint-plugin-eslint-comments](https://www.npmjs.com/package/eslint-plugin-eslint-comments)
- [eslint-plugin-json-schema-validator](https://www.npmjs.com/package/eslint-plugin-json-schema-validator)
- [eslint-plugin-json](https://www.npmjs.com/package/eslint-plugin-json)
- [eslint-plugin-jsonc](https://www.npmjs.com/package/eslint-plugin-jsonc)
- [eslint-plugin-toml](https://www.npmjs.com/package/eslint-plugin-toml)
- [eslint-plugin-eslint-plugin](https://www.npmjs.com/package/eslint-plugin-eslint-plugin)

## Other Interesting Projects

- [Awesome ESLint](https://github.com/dustinspecker/awesome-eslint)
- [ESLint Config Hardcore](https://github.com/EvgenyOrekhov/eslint-config-hardcore)
- [Neon ESLint Config](https://github.com/iCrawl/eslint-config-neon)

## Rules to Consider

- @typescript-eslint/prefer-readonly-parameter-types
  - For a stricter ruleset
- @typescript-eslint/no-deprecated
  - New
- @typescript-eslint/switch-exhaustiveness-check (New options added)
  - New
