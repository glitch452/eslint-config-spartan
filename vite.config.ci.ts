import { InlineConfig } from 'vitest/node';
import baseConfig from './vite.config.js';
import { defineConfig } from 'vitest/config';

const { test: baseConfigTest, ...baseConfigRest } = baseConfig;
const baseCoverage: Omit<NonNullable<InlineConfig['coverage']>, 'reporter'> | undefined = baseConfigTest?.coverage;

const configForCi = defineConfig({
  ...baseConfigRest,
  test: {
    ...baseConfigTest,
    allowOnly: false,
    coverage: {
      ...baseCoverage,
      reporter: ['text', 'json', 'json-summary'],
      reportOnFailure: true,
    },
    reporters: [
      'default',
      'github-actions',
      [
        'junit',
        {
          outputFile: 'reports/vitest-junit-report.xml',
          ancestorSeparator: ' > ',
          uniqueOutputName: 'false',
          reportTestSuiteErrors: 'true',
          suiteNameTemplate: '{filepath}',
          classNameTemplate: '{classname}',
          titleTemplate: '{title}',
        },
      ],
    ],
  },
});

export default configForCi;
