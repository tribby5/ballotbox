import type { VoteResultsSummary } from './voteResultsRecord';
import { VOTING_METHODS } from '$lib/votingMethods';
import { loadResultsState, type ResultsLoadState } from './resultsPage.load';

export type ResultsViewState = {
  loading: boolean;
  loadError: string | null;
  needsPassword: boolean;
  passwordError: string | null;
  summary: VoteResultsSummary | null;
};

export function emptyResultsView(): ResultsViewState {
  return {
    loading: true,
    loadError: null,
    needsPassword: false,
    passwordError: null,
    summary: null,
  };
}

export function applyResultsLoadState(
  state: ResultsLoadState,
  current: ResultsViewState,
): ResultsViewState {
  if (state.kind === 'error') {
    return {
      ...current,
      loading: false,
      loadError: state.message,
      needsPassword: false,
      passwordError: null,
      summary: null,
    };
  }
  if (state.kind === 'password') {
    return {
      ...current,
      loading: false,
      loadError: null,
      needsPassword: true,
      passwordError: state.passwordError,
      summary: null,
    };
  }
  if (state.kind === 'summary') {
    return {
      ...current,
      loading: false,
      loadError: null,
      needsPassword: false,
      passwordError: null,
      summary: state.summary,
    };
  }
  return current;
}

export async function fetchResultsView(
  voteId: string,
  password?: string,
): Promise<ResultsLoadState> {
  return loadResultsState(voteId, password);
}

export function resultsMethodLabel(summary: VoteResultsSummary | null): string {
  if (!summary) return '';
  return (
    VOTING_METHODS.find((m) => m.value === summary.vote.voting_method)?.label ?? 'Unknown method'
  );
}

export function resultsVoteCountLine(summary: VoteResultsSummary | null): string {
  if (!summary) return '';
  return `${summary.responseCount} ${summary.responseCount === 1 ? 'vote' : 'votes'} received`;
}
