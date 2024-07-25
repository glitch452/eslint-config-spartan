import { Options, defineConfig } from 'tsup';

const dateFormat = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour12: false,
  hour: 'numeric',
  minute: '2-digit',
  timeZoneName: 'short',
  timeZone: 'America/Toronto',
} satisfies Intl.DateTimeFormatOptions;

const banner = ((_context) => {
  const lines = [
    '/*',
    ` * ©${new Date().getFullYear()} David Dearden`,
    ` * Build Date: ${new Date().toISOString()} (${new Date().toLocaleString('en-CA', dateFormat)})`,
  ];

  if (process.env.GITHUB_SHA) {
    lines.push(` * Git Hash: ${process.env.GITHUB_SHA}`);
  }

  lines.push(' */');

  return { js: lines.join('\n') };
}) satisfies Options['banner'];

const tsupConfig = defineConfig({
  banner,
  bundle: true,
  // legacyOutput: true,
  clean: true,
  dts: true,
  entry: ['src/**/index.js'],
  format: ['cjs', 'esm'],
  minify: true,
  outDir: 'dist',
  skipNodeModulesBundle: true,
  // splitting: false,
  target: 'es2022',
  watch: false,
  // plugins: [
  //   {
  //     // https://github.com/egoist/tsup/issues/953#issuecomment-2294998890
  //     // ensuring that all local requires/imports in `.cjs` files import from `.cjs` files.
  //     // require('./path') → require('./path.cjs') in `.cjs` files
  //     // require('../path') → require('../path.cjs') in `.cjs` files
  //     // from './path' → from './path.cjs' in `.cjs` files
  //     // from '../path' → from '../path.cjs' in `.cjs` files
  //     name: 'fix-cjs-imports',
  //     renderChunk(code) {
  //       if (this.format === 'cjs') {
  //         const regexCjs = /require\((?<quote>['"])(?<import>\.[^'"]+)\.js['"]\)/g;
  //         const regexEsm = /from(?<space>[\s]*)(?<quote>['"])(?<import>\.[^'"]+)\.js['"]/g;
  //         return {
  //           code: code
  //             .replace(regexCjs, 'require($<quote>$<import>.cjs$<quote>)')
  //             .replace(regexEsm, 'from$<space>$<quote>$<import>.cjs$<quote>'),
  //         };
  //       }
  //     },
  //   },
  // ],
});

export default tsupConfig;
