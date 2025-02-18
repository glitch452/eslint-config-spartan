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
  clean: true,
  dts: true,
  entry: ['src/**/index.js'],
  format: ['cjs', 'esm'],
  minify: false,
  outDir: 'dist',
  skipNodeModulesBundle: true,
  target: 'es2022',
  watch: false,
});

export default tsupConfig;
