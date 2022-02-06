import { Linter, Rule, SourceCode } from 'eslint';
import { transformRule, type TransformRuleOption } from './transform-rule.js';
import {
  type FixableMaker,
  type SuggestionFilter,
  type TransformToApplySuggestionsArgs,
  type TransformToDisablePerFileArgs,
  type TransformToDisablePerLineArgs,
  type TransformToMakeFixableAndFixArgs,
} from './transforms/index.js';

export { TransformRuleOption, type FixableMaker, type SuggestionFilter };

export const eslintInteractivePlugin = {
  rules: {
    transform: transformRule,
  },
};

/**
 * The type representing the transform to do.
 */
export type Transform =
  | { name: 'disablePerLine'; args: TransformArg<'disablePerLine'> }
  | { name: 'disablePerFile'; args: TransformArg<'disablePerFile'> }
  | { name: 'applySuggestions'; args: TransformArg<'applySuggestions'> }
  | { name: 'makeFixableAndFix'; args: TransformArg<'makeFixableAndFix'> };

export type TransformName = 'disablePerLine' | 'disablePerFile' | 'applySuggestions' | 'makeFixableAndFix';

export type TransformArg<T extends TransformName> = T extends 'disablePerLine'
  ? TransformToDisablePerLineArgs
  : T extends 'disablePerFile'
  ? TransformToDisablePerFileArgs
  : T extends 'applySuggestions'
  ? TransformToApplySuggestionsArgs
  : T extends 'makeFixableAndFix'
  ? TransformToMakeFixableAndFixArgs
  : never;

/**
 * The type representing the additional information for the transform.
 */
export type TransformContext = {
  filename: string;
  sourceCode: SourceCode;
  messages: Linter.LintMessage[];
  ruleIds: string[];
};

/**
 * The type representing the transform function.
 */
export type TransformFunction<T> = (context: TransformContext, args: T) => Rule.Fix[];
