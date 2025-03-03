import { RuleConfigSeverity, TargetCaseType, UserConfig } from '@commitlint/types';

const subjectCase: TargetCaseType[] = ['sentence-case'];
if (process.env.ENV === 'ci') {
  // Add 'lower-case' to support Renovate Bot
  subjectCase.push('lower-case');
}

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [RuleConfigSeverity.Error, 'always', subjectCase],
  },
} satisfies UserConfig;
