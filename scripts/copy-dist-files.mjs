#!/usr/bin/env node

'use strict';

import path from 'path';
import fs from 'fs';
import { Command } from '@commander-js/extra-typings';

/**
 * Copies required build files from source to the build output directory
 * @param {string} srcDirArg The location of the source files, the root of where to copy FROM
 * @param {string} destDirArg The location of the destination files, the root of where to copy TO
 */
function main(srcDirArg, destDirArg) {
  const srcDir = path.isAbsolute(srcDirArg) ? srcDirArg : path.join(process.cwd(), srcDirArg);
  const destDir = path.isAbsolute(destDirArg) ? destDirArg : path.join(process.cwd(), destDirArg);

  const files = ['README.md'];

  for (const file of files) {
    const src = path.join(srcDir, file);
    const dest = path.join(destDir, file);
    fs.cpSync(src, dest, { recursive: true });
  }
}

new Command()
  .description('Copies required build files from source to the build output directory')
  .argument('[srcDir]', 'The location of the source files, the root of where to copy FROM', '.')
  .argument('[destDir]', 'The location of the destination files, the root of where to copy TO', '.')
  .action((srcDir, destDir) => {
    performance.mark('start');
    console.info(`Running script "${path.basename(import.meta.filename)}" with arguments:`, { srcDir, destDir });
    main(srcDir, destDir);
    console.info(' -- completed in', performance.measure('runtime', 'start').duration.toFixed(4), 'ms --\n');
  })
  .showHelpAfterError()
  .parse();
