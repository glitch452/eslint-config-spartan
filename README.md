# ESLint Config Spartan

[![NPM License](https://img.shields.io/npm/l/eslint-config-spartan)](https://choosealicense.com/licenses/mit/)
[![NPM Version](https://img.shields.io/npm/v/eslint-config-spartan)](https://www.npmjs.com/package/eslint-config-spartan)
[![NPM Downloads](https://img.shields.io/npm/dw/eslint-config-spartan?logo=npm)](https://www.npmjs.com/package/eslint-config-spartan)

<img src="assets/spartan-icon.jpg" width="150" height="150">

`eslint-config-spartan` is an opinionated [eslint](https://eslint.org) configuration with separate configs (called
mixins) for various eslint plugins.

**Details:**

- **Config Format:** `Flat config` No support for the `eslintrc` format.
- **ESLint Version:** `^8.57.0` Migration to v9 will happen once the ecosystem of plugins have been updated to support
  v9.
- **Module Type**: `ESM` and `CJS`

> [!NOTE]
>
> `eslint-config-spartan` aims to adhere to [semantic versioning](https://semver.org), however, while the initial
> configuration and API structure is being crafted, it will release breaking changes as `minor` versions. This applies
> to versions `0.x.x`. Once it reaches version `1.0.0`, it will be considered stable, and breaking changes will be
> released as new `major` versions.

## Table of Contents

- [ESLint Config Spartan](#eslint-config-spartan)
  - [Table of Contents](#table-of-contents)
  - [Philosophy](#philosophy)
  - [Build Config](#build-config)
  - [Utilities](#utilities)
    - [Files](#files)
    - [Merge Config](#merge-config)
  - [Mixins](#mixins)
    - [Chai](#chai)
    - [Common Js](#common-js)
    - [Cypress](#cypress)
    - [i18n JSON](#i18n-json)
    - [i18next](#i18next)
    - [Jest](#jest)
    - [Jest DOM](#jest-dom)
    - [JS Doc](#js-doc)
    - [JSX Accessibility](#jsx-accessibility)
    - [Markdown and MDX](#markdown-and-mdx)
    - [Mocha](#mocha)
    - [NextJs](#nextjs)
    - [Prettier](#prettier)
    - [Promise](#promise)
    - [React](#react)
    - [Regular Expressions (RegExp)](#regular-expressions-regexp)
    - [Storybook](#storybook)
    - [Tailwind CSS](#tailwind-css)
    - [Testing Library / React](#testing-library--react)
    - [Type Enabled](#type-enabled)
    - [Unicorn](#unicorn)
    - [Vitest](#vitest)
  - [Remark](#remark)
    - [Usage](#usage)
    - [Usage With Prettier](#usage-with-prettier)
  - [License](#license)

## Philosophy

For the most part, `eslint-config-spartan` aims to be opinionated in areas that promote good practices and prevent
common pitfalls and/or foot-guns. `eslint-config-spartan` tries not to be over opinionated in ares that are not related
to preventing errors; however, some of the opinions are also chosen for the sake of consistency, especially when
auto-fix rules are available to help maintain the consistency without extra burden for the writer.

`eslint-config-spartan` also strongly recommends the use of code-formatting tools, such as
[prettier](https://prettier.io). Such tools help to remove some mental load from the writer. They also assist the
reader, where the consistency can help to more quickly parse though code. This can also help with code review, since the
reviewer can focus more of their energy on the functionality of the code. Lastly, these can help to reduce diffs in git
commits, which also helps with code review, since it's easier to focus in on what has actually changed, rather than what
was simply reformatted.

## Build Config

The primary export of this config is a function called `buildConfig`. This function returns the base config and can
receive other configs or mixins as inputs, which are included in the final config array output.

> [!NOTE]
>
> This config does not enable any rules from `typescript-eslint` that require type information. These rules are
> extremely useful, however they can cause performance issue in some code bases, so they have been separated into their
> own [mixin](#type-enabled) to be applied as separately. See
> [Linting with Type Information](https://typescript-eslint.io/getting-started/typed-linting/) for details.

**The base config includes the following plugins:**

- The [@eslint/js](https://www.npmjs.com/package/@eslint/js) rules have no prefix
- The [typescript-eslint](https://www.npmjs.com/package/typescript-eslint) rules are prefixed with `@typescript-eslint`
- The [@stylistic/eslint-plugin](https://www.npmjs.com/package/@stylistic/eslint-plugin) rules are prefixed with
  `@stylistic`
- The [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import) rules are prefixed with `import`
- The [eslint-plugin-security](https://www.npmjs.com/package/eslint-plugin-security) rules are prefixed with `security`
- The [eslint-plugin-unused-imports](https://www.npmjs.com/package/eslint-plugin-unused-imports) rules are prefixed with
  `unused-imports`
- The [eslint-plugin-typescript-enum](https://www.npmjs.com/package/eslint-plugin-typescript-enum) rules are prefixed
  with `typescript-enum`

**Example:**

```js
// eslint.config.js
import { buildConfig } from 'eslint-config-spartan';
import { jsDoc, prettier, typeChecked } from 'eslint-config-spartan/mixins';
import { files } from 'eslint-config-spartan/utils';

export default buildConfig(
  typeChecked({
    parserOptions: {
      tsconfigRootDir: __dirname,
      project: './tsconfig.json',
    },
  }),
  jsDoc,
  {
    name: 'root/scripts',
    files: [`scripts/${files.jsTsNoX}`],
    rules: {
      '@typescript-eslint/no-magic-numbers': 'off',
      'security/detect-non-literal-fs-filename': 'off',
    },
  },
  prettier,
  { ignores: ['coverage/', 'reports/', '.vscode/', 'dist/'] },
);
```

## Utilities

### Files

The `files` utility contains a set of commonly used glob patterns for various file names and extensions that may require
linting. These can be used as items in the `files` or `ignores` fields in a flat config object.

**Example:**

```js
import { files } from 'eslint-config-spartan/utils';

const config = {
  files: [files.jsTs, files.markdown],
  rules: {
    // ... Additional rules
  },
};
```

### Merge Config

The `mergeConfig` utility combines the given config options into an array of single configs. Each input can be an
individual config, a function that returns a config (or array of configs), or an array of the previous types.

This would be useful in a monorepo where there is a main `eslint.config.js` file that exports a base config, which can
be extended by using this utility.

**Example:**

```js
// eslint.config.js
import base from '../../eslint.config.js';
import { jsDoc, mdx, nextJs, prettier, react } from 'eslint-config-spartan/mixins';
import { files, mergeConfig } from 'eslint-config-spartan/utils';

export default mergeConfig(base, jsDoc, react, nextJs, mdx({ files: [files.mdx] }), prettier);
```

## Mixins

Mixins are functions which return an eslint config. Most of the mixins import a plugin along with some configured rules.
The mixins have some inputs for convenience, i.e. choosing which files the mixin applies to, but the rules and config
can be overridden in a subsequent config in the final config array.

### Chai

The `chai` mixin creates an ESLint config for
[eslint-plugin-chai-friendly](https://www.npmjs.com/package/eslint-plugin-chai-friendly) and
[eslint-plugin-chai-expect](https://www.npmjs.com/package/eslint-plugin-chai-expect) to assist with using the
[Chai Assertion Library](https://www.chaijs.com).

Rule Prefixes:

- The `eslint-plugin-chai-expect` rules are prefixed with `chai-expect`
- The `eslint-plugin-chai-friendly` rules are prefixed with `chai-friendly`

> [!NOTE]
>
> Note: This config also adjusts some `@typescript-eslint` rules to make them more helpful for test files.

```js
import { chai } from 'eslint-config-spartan/mixins';
```

### Common Js

The `commonJs` mixin creates an ESLint config for common js files.

This config is included in `buildConfig` and applied to files with common js extensions. This can be used to apply the
config to `.js` files which are known to be common js.

Note: This config also adjusts some `@typescript-eslint` and `unicorn` rules that conflict with common js globals. This
config should be added after the configs for these rules.

```js
import { commonJs } from 'eslint-config-spartan/mixins';
```

### Cypress

The `cypress` mixin creates an ESLint config for
[eslint-plugin-cypress](https://www.npmjs.com/package/eslint-plugin-cypress) to assist with using the
[Cypress](https://www.cypress.io) Testing Framework.

Rule Prefixes:

- The `eslint-plugin-cypress` rules are prefixed with `cypress`

> [!NOTE]
>
> Note: This config also adjusts some `@typescript-eslint` rules to make them more helpful for test files.

```js
import { cypress } from 'eslint-config-spartan/mixins';
```

### i18n JSON

The `i18nJson` mixin creates an ESLint config for
[eslint-plugin-i18n-json](https://www.npmjs.com/package/eslint-plugin-i18n-json) to assist with maintaining json-based
i18n translation files.

Rule Prefixes:

- The `eslint-plugin-i18n-json` rules are prefixed with `i18n-json`

```js
import { i18nJson } from 'eslint-config-spartan/mixins';

export default buildConfig(
  i18nJson({
    files: ['src/translations/*.json'],
    identicalKeysFilePath: path.resolve('src/translations/en.json'),
  }),
);
```

> [!TIP]
>
> To see linting errors and apply auto-fix rules on save for `.json` files in VS Code, add the `json` language to the
> `validate` list in the VS Code settings for `eslint`.
>
> ```json
> // .vscode/settings.json
> {
>   "eslint.validate": ["json"]
> }
> ```

### i18next

The `i18next` mixin creates an ESLint config for
[eslint-plugin-i18next](https://www.npmjs.com/package/eslint-plugin-i18next) to assist with using the
[i18next](https://www.i18next.com) internationalization library.

Rule Prefixes:

- The `eslint-plugin-i18next` rules are prefixed with `i18next`

```js
import { i18next } from 'eslint-config-spartan/mixins';
```

### Jest

The `jest` mixin creates an ESLint config for [eslint-plugin-jest](https://www.npmjs.com/package/eslint-plugin-jest) to
assist with using the [jest](https://jestjs.io) testing framework.

Rule Prefixes:

- The `eslint-plugin-jest` rules are prefixed with `jest`

> [!NOTE]
>
> Note: This config also adjusts some `@typescript-eslint` rules to make them more helpful for test files.

```js
import { jest } from 'eslint-config-spartan/mixins';
```

### Jest DOM

The `jestDom` mixin creates an ESLint config for
[eslint-plugin-jest-dom](https://www.npmjs.com/package/eslint-plugin-jest-dom) to assist with using the
[jest-dom](https://testing-library.com/docs/ecosystem-jest-dom/) element matchers.

Rule Prefixes:

- The `eslint-plugin-jest-dom` rules are prefixed with `jest-dom`

```js
import { jestDom } from 'eslint-config-spartan/mixins';
```

### JS Doc

The `jsDoc` mixin creates an ESLint config for [eslint-plugin-jsdoc](https://www.npmjs.com/package/eslint-plugin-jsdoc)
to assist with writing [JS Doc](https://jsdoc.app) comments.

This creates three configurations, one to apply the recommended rules to js files, another to apply the recommended
rules to ts files and a third to configure rules across both sets of files.

Rule Prefixes:

- The `eslint-plugin-jsdoc` rules are prefixed with `jsdoc`

```js
import { jsDoc } from 'eslint-config-spartan/mixins';
```

### JSX Accessibility

The `jsxA11y` mixin creates an ESLint config for
[eslint-plugin-jsx-a11y](https://www.npmjs.com/package/eslint-plugin-jsx-a11y) to assist with accessibility when using
JSX templates.

Rule Prefixes:

- The `eslint-plugin-jsx-a11y` rules are prefixed with `jsx-a11y`.

```js
import { jsxA11y } from 'eslint-config-spartan/mixins';
```

### Markdown and MDX

The `mdx` mixin creates an ESLint config for [eslint-plugin-mdx](https://www.npmjs.com/package/eslint-plugin-mdx) to
assist with writing [MDX](https://mdxjs.com) and [markdown](https://en.wikipedia.org/wiki/Markdown) files, as well as
code blocks within markdown files. This also adds support for using
[remark-lint](https://github.com/remarkjs/remark-lint) rules within those files. See the [Remark](#remark) section of
this document for more details.

This creates two configurations, one to apply the recommended config for `.mdx`, `.md`, and `.markdown` files, and
another to apply the recommended config to code blocks in those files.

> [!NOTE]
>
> - This config also adjusts some rules to accommodate mdx syntax and code blocks.
> - The typescript-eslint rules that require type information cannot be used within code blocks, since the parser cannot
>   parse the blocks within the files.

Rule Prefixes:

- The `eslint-plugin-mdx` rules are prefixed with `mdx`.

> [!TIP]
>
> To apply rules to the code blocks, the format for selecting the code block type is by first selecting the markdown
> file itself, then adding the block type to the path. e.g. `*.{md,mdx}/js` to select all `js` code blocks within `.md`
> or `.mdx` files.

```js
import { mdx } from 'eslint-config-spartan/mixins';
```

### Mocha

The `mocha` mixin creates an ESLint config for [eslint-plugin-mocha](https://www.npmjs.com/package/eslint-plugin-mocha)
to assist with using the [Mocha](https://mochajs.org) test framework.

> [!NOTE]
>
> Note: This config also adjusts some `@typescript-eslint` rules to make them more helpful for test files.

Rule Prefixes:

- The `eslint-plugin-mocha` rules are prefixed with `mocha`

```js
import { mocha } from 'eslint-config-spartan/mixins';
```

### NextJs

The `nextJs` mixin creates an ESLint config for
[@next/eslint-plugin-next](https://www.npmjs.com/package/@next/eslint-plugin-next) to assist with
[Next.js](https://nextjs.org) application development.

Rule Prefixes:

- The `eslint-plugin-next` rules are prefixed with `@next/next`

```js
import { nextJs } from 'eslint-config-spartan/mixins';
```

### Prettier

The `prettier` mixin creates an ESLint config for disabling rules which may interfere or conflict with
[Prettier](https://prettier.io).

> [!IMPORTANT]
>
> This config must come LAST in the list of configurations so that it can override other configs.

> [!NOTE]
>
> This config essentially re-exports [eslint-config-prettier](https://www.npmjs.com/package/eslint-config-prettier) with
> some adjustments. It also disables rules for
> [@stylistic/eslint-plugin](https://www.npmjs.com/package/@stylistic/eslint-plugin).

```js
import { prettier } from 'eslint-config-spartan/mixins';
```

### Promise

The `promise` mixin creates an ESLint config for
[eslint-plugin-promise](https://www.npmjs.com/package/eslint-plugin-promise) to assist with encouraging good practices
when using JS Promises.

Rule Prefixes:

- The `eslint-plugin-promise` rules are prefixed with `promise`

```js
import { promise } from 'eslint-config-spartan/mixins';
```

### React

The `react` mixin creates an ESLint config for [eslint-plugin-react](https://www.npmjs.com/package/eslint-plugin-react)
and [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks) to assist with
[React](https://react.dev) application development.

Rule Prefixes:

- The `eslint-plugin-react` rules are prefixed with `react`
- The `eslint-plugin-react-hooks` rules are prefixed with `react-hooks`

```js
import { react } from 'eslint-config-spartan/mixins';
```

### Regular Expressions (RegExp)

The `regExp` mixin creates an ESLint config for
[eslint-plugin-regexp](https://www.npmjs.com/package/eslint-plugin-regexp) to assist with encouraging good practices
when using [JS Regular Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions).

Rule Prefixes:

- The `eslint-plugin-regexp` rules are prefixed with `regexp`

```js
import { regExp } from 'eslint-config-spartan/mixins';
```

### Storybook

The `storybook` mixin creates an ESLint config for
[eslint-plugin-storybook](https://www.npmjs.com/package/eslint-plugin-storybook) to assist with component development in
[Storybook](https://storybook.js.org).

Rule Prefixes:

- The `eslint-plugin-storybook` rules are prefixed with `storybook`

```js
import { storybook } from 'eslint-config-spartan/mixins';
```

### Tailwind CSS

The `tailwindCss` mixin creates an ESLint config for
[eslint-plugin-tailwindcss](https://www.npmjs.com/package/eslint-plugin-tailwindcss) to assist with using the
[Tailwind CSS](https://tailwindcss.com) framework.

Rule Prefixes:

- The `eslint-plugin-tailwindcss` rules are prefixed with `tailwindcss`

```js
import { tailwindCss } from 'eslint-config-spartan/mixins';
```

### Testing Library / React

The `testingLibraryReact` mixin creates an ESLint config for
[eslint-plugin-testing-library](https://www.npmjs.com/package/eslint-plugin-testing-library) to assist with component
testing using [Testing Library](https://testing-library.com).

Rule Prefixes:

- The `eslint-plugin-testing-library` rules are prefixed with `testing-library`

```js
import { testingLibraryReact } from 'eslint-config-spartan/mixins';
```

### Type Enabled

The `typeEnabled` mixin creates an eslint config with type-enabled rules for
[typescript-eslint](https://typescript-eslint.io). It requires an external config to enable the `@typescript-eslint`
plugin itself since it only includes rules. i.e. it's meant to bs used with the base config created with
[Build Config](#build-config). It also disables base eslint rules that are replaced with the equivalent
typescript-eslint rules.

> [!NOTE]
>
> Note: This config also adds an ignores property to prevent these rules from being applied to code blocks within
> markdown files when the `mdx` mixin is being used since the parser cannot access that code.

Rule Prefixes:

- The `typescript-eslint` rules are prefixed with `@typescript-eslint`

```js
import { typeEnabled } from 'eslint-config-spartan/mixins';
```

### Unicorn

The `unicorn` mixin creates an ESLint config for
[eslint-plugin-unicorn](https://www.npmjs.com/package/eslint-plugin-unicorn) which contains miscellaneous rules.

Rule Prefixes:

- The `eslint-plugin-unicorn` rules are prefixed with `unicorn`

```js
import { unicorn } from 'eslint-config-spartan/mixins';
```

### Vitest

The `vitest` mixin creates an ESLint config for
[eslint-plugin-vitest](https://www.npmjs.com/package/eslint-plugin-vitest) to assist with using the
[Vitest](https://vitest.dev) Testing Framework.

Rule Prefixes:

- The `eslint-plugin-vitest` rules are prefixed with `vitest`

> [!NOTE]
>
> Note: This config also adjusts some `@typescript-eslint` rules to make them more helpful for test files.

```js
import { vitest } from 'eslint-config-spartan/mixins';
```

## Remark

Since [eslint-plugin-mdx](https://www.npmjs.com/package/eslint-plugin-mdx) supports additional linting of markdown/mdx
files using [remark](https://github.com/remarkjs/remark-lint), we have included a remark lint preset.

### Usage

To use the included preset:

1. Create the remark rc file at the root of your project (i.e. `.remarkrc.mjs`).
2. Import the `remark` preset.
3. Export the config with the preset included.

```js
// .remarkrc.mjs
import { remark } from 'eslint-config-spartan/remark';

export default { plugins: [remark] };
```

> [!NOTE]
>
> The [Markdown and MDX](#markdown-and-mdx) mixin is already configured to run `remark-lint` on the markdown and mdx
> files. Once a `remarkrc` file is available, it will start reporting `remark-lint` errors through ESLint.

### Usage With Prettier

Similarly to ESLint, many of the `remark-lint` rules conflict with the prettier formatting. We also include a prettier
preset which disables the conflicting rules. As with the ESLint prettier config, the prettier preset should also be
included at the end of the plugins list.

```js
// .remarkrc.mjs
import { remark, remarkPrettier } from 'eslint-config-spartan/remark';

export default { plugins: [remark, remarkPrettier] };
```

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE) as defined by the
[Open Source Initiative](https://opensource.org/license/mit).
