/** @import { Linter } from 'eslint' */
/** @import { DeepConfig } from './types.js' */

/**
 * @param {...DeepConfig} configs
 * @returns {Linter.Config[]}
 */
export function mergeConfig(...configs) {
  return configs
    .map((config) => {
      if (Array.isArray(config)) {
        return mergeConfig(...config);
      }
      if (typeof config === 'function') {
        return mergeConfig(config());
      }
      return config;
    })
    .flat();
}
