import { getSupabaseBrowser } from '$lib/supabaseClient';
import type { VotingMethodValue } from '$lib/votingMethods';
import {
  tabulate,
  winnerLabels,
  type EngineOption,
  type ResultsComputation,
} from '$lib/results/tabulation';

export type VoteResultsSummary = {
  vote: {
    id: string;
    public_id: string;
    title: string;
    voting_method: VotingMethodValue;
    locked_at: string | null;
    password_protected: boolean;
  };
  responseCount: number;
  winnerLabels: string[];
  computation: ResultsComputation | null;
};

export type VoteResultsFetchResult =
  | { status: 'ok'; summary: VoteResultsSummary }
  | { status: 'password_required' }
  | { status: 'invalid_password' }
  | { status: 'not_found' };

type DetailRow = {
  vote: {
    id: string;
    public_id: string;
    title: string;
    voting_method: string;
    locked_at: string | null;
    password_protected: boolean;
  };
  options: { id: string; label: string; sort_order: number }[];
  ballots: string[][];
};

function isVotingMethod(v: string): v is VotingMethodValue {
  return (
    v === 'ranked_pairs' ||
    v === 'irv' ||
    v === 'single_plurality' ||
    v === 'borda' ||
    v === 'ir_borda' ||
    v === 'least_worst'
  );
}

function buildSummary(row: DetailRow): VoteResultsSummary | null {
  if (!isVotingMethod(row.vote.voting_method)) return null;
  const options: EngineOption[] = [...(row.options ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((o) => ({ id: o.id, label: o.label }));
  const ballots = row.ballots ?? [];
  const computation = tabulate(row.vote.voting_method, options, ballots);
  return {
    vote: {
      id: row.vote.id,
      public_id: row.vote.public_id,
      title: row.vote.title,
      voting_method: row.vote.voting_method,
      locked_at: row.vote.locked_at,
      password_protected: row.vote.password_protected,
    },
    responseCount: ballots.length,
    winnerLabels: winnerLabels(computation),
    computation,
  };
}

export async function fetchVoteResultsSummary(
  publicId: string,
  password?: string,
): Promise<VoteResultsFetchResult> {
  const supabase = getSupabaseBrowser();
  if (!supabase) return { status: 'not_found' };

  const { data, error } = await supabase.rpc('get_vote_results_detail', {
    p_public_id: publicId,
    p_password: password?.trim() ? password.trim() : null,
  });

  if (error) {
    const msg = error.message ?? '';
    if (msg.includes('PASSWORD_REQUIRED')) return { status: 'password_required' };
    if (msg.includes('INVALID_PASSWORD')) return { status: 'invalid_password' };
    throw error;
  }

  if (!data) return { status: 'not_found' };

  const summary = buildSummary(data as DetailRow);
  if (!summary) return { status: 'not_found' };
  return { status: 'ok', summary };
}
