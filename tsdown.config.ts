import fs from 'node:fs';
import { type UserConfig, defineConfig } from 'tsdown';

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

interface PackageJson {
  author: string;
  homepage: string;
  license: string;
  name: string;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion
const packageJson = JSON.parse(fs.readFileSync('./package.json').toString()) as PackageJson;

const banner = ((_context) => {
  const lines = [
    '/*',
    ` * ${packageJson.name}`,
    ` * ©${new Date().getFullYear()} ${packageJson.author}`,
    ` * License: ${packageJson.license}`,
    ` * Homepage: ${packageJson.homepage}`,
    ` * Build Date: ${new Date().toISOString()} (${new Date().toLocaleString('en-CA', dateFormat)})`,
  ];

  if (process.env.BUILD_VERSION) {
    lines.push(` * Version: ${process.env.BUILD_VERSION}`);
  }

  if (process.env.GITHUB_SHA) {
    lines.push(` * Git Hash: ${process.env.GITHUB_SHA}`);
  }

  lines.push(' */');

  return { js: lines.join('\n') };
}) satisfies UserConfig['banner'];

const tsupConfig = defineConfig({
  banner,
  clean: true,
  deps: { skipNodeModulesBundle: true },
  dts: true,
  entry: ['src/**/index.js'],
  format: ['cjs', 'esm'],
  minify: false,
  outDir: 'dist',
  outExtensions: ({ format }) => ({ js: format === 'es' ? '.js' : '.cjs' }),
  target: 'es2022',
});

export default tsupConfig;
