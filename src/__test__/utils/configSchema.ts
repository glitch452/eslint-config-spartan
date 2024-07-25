import { z } from 'zod';

const initialEcmaVersion = 3;
const initialEcmaYear = 2015;
const nextYear = new Date().getFullYear() + 1;
const minEcmaVersion = 5;
const maxEcmaVersion = nextYear - initialEcmaYear + minEcmaVersion + 1;

const ecmaVersionSchema = z.union([
  z.literal('latest'),
  z.literal(initialEcmaVersion),
  z.number().int().min(minEcmaVersion).max(maxEcmaVersion),
  z.number().int().min(initialEcmaYear).max(nextYear),
]);
const sourceTypeSchema = z.enum(['script', 'module', 'commonjs']);
const globalConfSchema = z.boolean().or(z.enum(['off', 'readable', 'readonly', 'writable', 'writeable']));

const minSeverity = 0;
const maxSeverity = 2;
const severitySchema = z.number().int().min(minSeverity).max(maxSeverity);
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
    fixable: z.enum(['code', 'whitespace']).or(z.null()),
    schema: z.unknown(),
    deprecated: z.boolean(),
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
