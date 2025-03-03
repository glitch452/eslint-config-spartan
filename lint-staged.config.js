export default {
  '*.{md,mdx,mjs,cjs,js,jsx,cjsx,mjsx,mts,cts,ts,tsx,ctsx,mtsx}': [
    'eslint --cache --report-unused-disable-directives --fix',
    'prettier --ignore-unknown --write',
  ],
  '*.{css,html,json,scss,yaml,yml}': 'prettier --ignore-unknown --write',
  'renovate.json5': [
    'prettier --ignore-unknown --write',
    'npx --yes --package renovate -- renovate-config-validator --strict',
  ],
};
