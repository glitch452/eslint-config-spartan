import { z } from 'zod';

const INITIAL_ECMA_VERSION = 3;
const INITIAL_ECMA_YEAR = 2015;
const NEXT_YEAR = new Date().getFullYear() + 1;
const MIN_ECMA_VERSION = 5;
const MAX_ECMA_VERSION = NEXT_YEAR - INITIAL_ECMA_YEAR + MIN_ECMA_VERSION + 1;

const ecmaVersionSchema = z.union([
  z.literal('latest'),
  z.literal(INITIAL_ECMA_VERSION),
  z.number().int().min(MIN_ECMA_VERSION).max(MAX_ECMA_VERSION),
  z.number().int().min(INITIAL_ECMA_YEAR).max(NEXT_YEAR),
]);
const sourceTypeSchema = z.enum(['script', 'module', 'commonjs']);
const globalConfSchema = z.boolean().or(z.enum(['off', 'readable', 'readonly', 'writable', 'writeable']));

const MIN_SEVERITY = 0;
const MAX_SEVERITY = 2;
const severitySchema = z.number().int().min(MIN_SEVERITY).max(MAX_SEVERITY);
const stringSeveritySchema = z.enum(['off', 'warn', 'error']);

const objectMetaPropertiesSchema = z.object({
  /** @deprecated Use `meta.name` instead. */
  name: z.string().optional(),
  /** @deprecated Use `meta.version` instead. */
  version: z.string().optional(),
  meta: z.object({ name: z.string().optional(), version: z.string().optional() }).optional(),
});

const esTreeParserSchema = z.union([
  objectMetaPropertiesSchema.extend({ parse: z.function() }),
  objectMetaPropertiesSchema.extend({ parseForESLint: z.function() }),
]);

const processorSchema = objectMetaPropertiesSchema.extend({
  supportsAutofix: z.boolean().optional(),
  preprocess: z.function(),
  postprocess: z.function(),
});

const parserOptionsSchema = z
  .object({
    ecmaVersion: ecmaVersionSchema,
    sourceType: sourceTypeSchema,
    ecmaFeatures: z
      .object({
        globalReturn: z.boolean(),
        impliedStrict: z.boolean(),
        jsx: z.boolean(),
        experimentalObjectRestSpread: z.boolean(),
      })
      .partial()
      .catchall(z.any()),
  })
  .partial()
  .catchall(z.any());

const languageOptionsSchema = z
  .object({
    ecmaVersion: ecmaVersionSchema,
    sourceType: sourceTypeSchema,
    globals: z.record(globalConfSchema),
    parser: esTreeParserSchema,
    parserOptions: parserOptionsSchema,
  })
  .partial();

const linterOptionsSchema = z
  .object({
    noInlineConfig: z.boolean().optional(),
    reportUnusedDisableDirectives: z.union([severitySchema, stringSeveritySchema, z.boolean()]).optional(),
  })
  .optional();

const externalSpecifierSchema = z.object({
  name: z.string().optional(),
  url: z.string().optional(),
});

const replacedBySchema = z.object({
  message: z.string().optional(),
  url: z.string().optional(),
  plugin: externalSpecifierSchema.optional(),
  rule: externalSpecifierSchema.optional(),
});

const deprecatedInfoSchema = z.object({
  message: z.string().optional(),
  url: z.string().optional(),
  replacedBy: replacedBySchema.array().optional(),
  deprecatedSince: z.string().optional(),
  availableUntil: z.string().nullable().optional(),
});

const ruleMetaDataSchema = z
  .object({
    docs: z
      .object({
        description: z.string(),
        category: z.string(),
        // Added z.string() to accommodate storybook plugin
        // Added z.record(z.unknown()) to accommodate typescript-eslint plugin
        recommended: z.union([z.boolean(), z.string(), z.record(z.unknown())]),
        url: z.string(),
      })
      .partial(),
    messages: z.record(z.string()),
    // Added z.null() added to accommodate the cypress plugin
    fixable: z.enum(['code', 'whitespace']).nullable(),
    schema: z.unknown(),
    deprecated: z.boolean().or(deprecatedInfoSchema),
    replacedBy: z.string().array().readonly(),
    // Added 'error' to accommodate the security plugin
    type: z.enum(['problem', 'suggestion', 'layout', 'error']),
    hasSuggestions: z.boolean(),
  })
  .partial();

const ruleModuleSchema = z.object({
  create: z.function(),
  meta: ruleMetaDataSchema.optional(),
});

const pluginSchema = z
  .object({
    configs: z.record(z.unknown()),
    environments: z.record(
      z.object({ globals: z.record(globalConfSchema), parserOptions: parserOptionsSchema }).partial(),
    ),
    processors: z.record(processorSchema),
    rules: z.record(ruleModuleSchema),
  })
  .partial();

export const configSchema = z
  .object({
    name: z.string(),
    files: z.array(z.string().or(z.string().array())),
    ignores: z.string().array(),
    languageOptions: languageOptionsSchema,
    linterOptions: linterOptionsSchema,
    processor: z.string().or(processorSchema),
    plugins: z.record(pluginSchema),
    rules: z.unknown(),
    settings: z.record(z.unknown()),
  })
  .partial();
