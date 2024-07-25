import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';

/**
 * A utility to create the FlatCompat object based on the eslint js recommended config.
 * @param {string=} baseDirectory The base directory for relative paths in the eslintrc config. Default process.cwd()
 */
export const flatCompat = (baseDirectory) =>
  new FlatCompat({ baseDirectory, recommendedConfig: js.configs.recommended });
