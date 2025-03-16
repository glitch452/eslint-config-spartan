/* eslint-disable @typescript-eslint/no-explicit-any */

interface EsLintPlugin {
  configs?: any;
  flatConfigs?: any;
  environments?: any;
  processors?: any;
  rules?: any;
}

interface RemarkPreset {
  settings?: Record<string, any>;
  plugins?: Array<any>;
}

type RemarkPlugin = () => any;

declare module 'eslint-plugin-import' {
  const module: EsLintPlugin;
  export default module;
}

declare module '@next/eslint-plugin-next' {
  const module: EsLintPlugin;
  export default module;
}

declare module 'eslint-plugin-typescript-enum' {
  const module: EsLintPlugin;
  export default module;
}

declare module 'eslint-plugin-cypress/flat' {
  const module: EsLintPlugin;
  export default module;
}

declare module 'eslint-plugin-chai-friendly' {
  const module: EsLintPlugin;
  export default module;
}

declare module 'eslint-plugin-chai-expect' {
  const module: EsLintPlugin;
  export default module;
}

declare module 'eslint-plugin-googleappsscript' {
  const module: EsLintPlugin;
  export default module;
}

declare module 'eslint-plugin-i18n-json' {
  const module: EsLintPlugin;
  export default module;
}

declare module 'eslint-plugin-promise' {
  const module: EsLintPlugin;
  export default module;
}
