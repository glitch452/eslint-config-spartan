#!/usr/bin/env node

'use strict';

import path from 'path';
import fs from 'fs';
import { Command } from '@commander-js/extra-typings';

// eslint-disable-next-line jsdoc/valid-types
const fileName = /** @type {const} */ ({
  TYPES_ESM: 'index.d.ts',
  TYPES_CJS: 'index.d.cts',
  ESM: 'index.js',
  CJS: 'index.cjs',
  ENTRYPOINT: 'index.js',
});

/**
 * @typedef {{
 *   types?: ExportsEntry;
 *   node?: ExportsEntry;
 *   require?: ExportsEntry;
 *   import?: ExportsEntry;
 *   default?: ExportsEntry;
 * } | string} ExportsEntry
 */

/**
 * A generator which walks directories starting at {@link dir} and yields relative directory paths for each directory
 * that includes an {@link entrypointFileName} file. The resulting paths are prefixed with the {@link relativeRoot}.
 * @param {string} dir The directory to start looking for index files from
 * @param {string=} relativeRoot The path to prefix each entrypoint with
 * @param {string=} entrypointFileName The name of the file that defines an entrypoint
 * @yields {string}
 * @returns {IterableIterator<string>}
 */
function* getEntrypointDirs(dir, relativeRoot = '.', entrypointFileName = fileName.ENTRYPOINT) {
  const dirContents = fs.readdirSync(dir, { withFileTypes: true });

  if (dirContents.find((c) => c.isFile() && c.name === entrypointFileName)) {
    yield relativeRoot;
  }

  for (const dirent of dirContents) {
    if (dirent.isDirectory()) {
      const nextDir = path.join(dir, dirent.name);
      const nextPrefix = path.join(relativeRoot, dirent.name);
      yield* getEntrypointDirs(nextDir, nextPrefix, entrypointFileName);
    }
  }
}

/**
 * Create the exports object containing all the entrypoints
 * @param {IterableIterator<string>} entrypoints The list of relative entrypoint paths
 * @param {string=} buildDir The directory where the final build output files are located
 */
function createExports(entrypoints, buildDir = '.') {
  /** @type {Record<string, ExportsEntry>} */
  const exports = {};

  for (const entrypoint of entrypoints) {
    const key = entrypoint.startsWith('.') ? entrypoint : `./${entrypoint}`;

    exports[key] = {
      // Note: `types` should be defined first. See https://nodejs.org/api/packages.html#community-conditions-definitions
      import: {
        types: `./${path.join(buildDir, entrypoint, fileName.TYPES_ESM)}`,
        import: `./${path.join(buildDir, entrypoint, fileName.ESM)}`,
      },
      require: {
        types: `./${path.join(buildDir, entrypoint, fileName.TYPES_CJS)}`,
        require: `./${path.join(buildDir, entrypoint, fileName.CJS)}`,
      },
      // Note: `default` should be defined last. See https://nodejs.org/api/packages.html#conditional-exports
      default: `./${path.join(buildDir, entrypoint, fileName.ESM)}`,
    };
  }

  return exports;
}

/**
 * Modifies and returns the package.json contents ready for publishing to npm
 * @param {Record<string, unknown>} packageJson The values of the package.json file
 * @param {Record<string, ExportsEntry>} exports The retrieved exports ready to be included in the bundle
 */
function preparePackageJson(packageJson, exports) {
  packageJson.type = 'module';
  packageJson.types = fileName.TYPES_ESM;
  packageJson.module = fileName.ESM;
  packageJson.main = fileName.CJS;
  packageJson.exports = exports;

  const propsToPurge = ['devDependencies', 'scripts', 'sideEffects', 'lint-staged'];

  for (const prop of propsToPurge) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete packageJson[prop];
  }
}

/**
 * Updates the package.json file in the working directory of the script by:
 * 1. Creating the outputs entrypoint definition based on the given args
 * 2. Pruning fields from the file that are not required for publishing
 * @param {string} srcDirArg The location of the source files where the entrypoints reside
 * @param {string=} destDirArg The destination directory for the final package.json file. Default is the current working directory.
 * @param {string=} buildDirArg The relative location of the build output files, relative to package.json file. Default is the same directory as the package.json file
 */
function main(srcDirArg, destDirArg = '.', buildDirArg = '.') {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = /** @type {Record<string, unknown>} */ (JSON.parse(fs.readFileSync(packageJsonPath).toString()));

  const srcDir = path.isAbsolute(srcDirArg) ? srcDirArg : path.join(process.cwd(), srcDirArg);
  const destDir = path.isAbsolute(destDirArg) ? destDirArg : path.join(process.cwd(), destDirArg);
  const buildDir = path.isAbsolute(buildDirArg) ? path.relative(process.cwd(), buildDirArg) : buildDirArg;
  const entrypoints = getEntrypointDirs(srcDir);

  const exports = createExports(entrypoints, buildDir);
  preparePackageJson(packageJson, exports);

  const packageJsonDistPath = path.join(destDir, 'package.json');
  const packageJsonString = JSON.stringify(packageJson, undefined, 2);
  fs.writeFileSync(packageJsonDistPath, packageJsonString);
}

new Command()
  .description('Copies required build files from source to the build output directory')
  .argument('<srcDir>', 'The location of the source files where the entrypoints reside')
  .argument(
    '[destDir]',
    'The destination directory for the final package.json file. Default is the current working directory.',
  )
  .argument(
    '[buildDir]',
    'The relative location of the build output files, relative to package.json file. Default is the same directory as the package.json file',
  )
  .action((srcDir, destDir, buildDir) => {
    performance.mark('start');
    console.info(`Running script "${path.basename(import.meta.filename)}" with arguments:`, {
      srcDir,
      destDir,
      buildDir,
    });
    main(srcDir, destDir, buildDir);
    console.info(' -- completed in', performance.measure('runtime', 'start').duration.toFixed(4), 'ms --\n');
  })
  .showHelpAfterError()
  .parse();
