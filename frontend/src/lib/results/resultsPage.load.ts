import {
  fetchVoteResultsSummary,
  type VoteResultsSummary,
} from '$lib/results/voteResultsRecord';

export type ResultsLoadState =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'password'; passwordError: string | null }
  | { kind: 'summary'; summary: VoteResultsSummary };

export async function loadResultsState(
  voteId: string,
  password?: string,
): Promise<ResultsLoadState> {
  try {
    const result = await fetchVoteResultsSummary(voteId, password);
    if (result.status === 'not_found') {
      return { kind: 'error', message: 'Vote not found, or Supabase is not configured.' };
    }
    if (result.status === 'password_required') {
      return { kind: 'password', passwordError: null };
    }
    if (result.status === 'invalid_password') {
      return { kind: 'password', passwordError: 'Incorrect password.' };
    }
    return { kind: 'summary', summary: result.summary };
  } catch (e) {
    return {
      kind: 'error',
      message: e instanceof Error ? e.message : 'Could not load results.',
    };
  }
}
