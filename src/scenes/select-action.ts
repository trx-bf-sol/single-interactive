import { ESLint } from 'eslint';
import { doApplySuggestionAction } from '../actions/apply-suggestion';
import { doDisableAction } from '../actions/disable';
import { doDisplayMessagesAction } from '../actions/display-messages';
import { doFixAction } from '../actions/fix';
import { promptToInputAction } from '../cli/prompt';
import { ESLintProxy } from '../eslint-proxy';
import { NextScene } from '../types';
import { unreachable } from '../util/type-check';

export type SelectActionArgs = {
  results: ESLint.LintResult[];
  ruleIdsInResults: string[];
  selectedRuleIds: string[];
};

export async function selectAction(
  eslint: ESLintProxy,
  { results, ruleIdsInResults, selectedRuleIds }: SelectActionArgs,
): Promise<NextScene> {
  const action = await promptToInputAction();

  if (action === 'reselectRules') return { name: 'selectRuleIds', args: { results, ruleIdsInResults } };

  if (action === 'displayMessages') {
    await doDisplayMessagesAction(eslint, results, selectedRuleIds);
    return { name: 'selectAction', args: { results, ruleIdsInResults, selectedRuleIds } };
  } else if (action === 'fix') {
    await doFixAction(eslint, selectedRuleIds);
    return { name: 'selectToContinue' };
  } else if (action === 'disable') {
    await doDisableAction(eslint, results, selectedRuleIds);
    return { name: 'selectToContinue' };
  } else if (action === 'applySuggestion') {
    await doApplySuggestionAction(eslint, results, selectedRuleIds);
    return { name: 'selectToContinue' };
  }
  return unreachable();
}
