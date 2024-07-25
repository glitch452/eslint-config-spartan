import type { Linter } from 'eslint';

export type MaybeArray<T> = T | Array<T>;

export type DeepConfig = MaybeArray<Linter.Config> | (() => MaybeArray<DeepConfig>) | DeepConfig[];
