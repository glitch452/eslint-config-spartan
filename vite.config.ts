import { defineConfig } from 'vitest/config';

const baseConfig = defineConfig({
  test: {
    globals: true,
    reporters: ['verbose'],
    coverage: {
      reporter: ['text'],
      include: ['src/**/*.js'],
      exclude: ['src/**/index.js', 'src/**/*.test.ts', 'src/**/*.d.ts'],
    },
  },
});

export default baseConfig;
