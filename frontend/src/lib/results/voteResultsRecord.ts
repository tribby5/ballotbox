import { getSupabaseBrowser } from '$lib/supabaseClient';
import type { VotingMethodValue } from '$lib/votingMethods';

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
  winnerLabel: string;
};

export type VoteResultsFetchResult =
  | { status: 'ok'; summary: VoteResultsSummary }
  | { status: 'password_required' }
  | { status: 'invalid_password' }
  | { status: 'not_found' };

type RpcRow = {
  vote_id: string;
  public_id: string;
  title: string;
  voting_method: string;
  locked_at: string | null;
  password_protected: boolean;
  response_count: number;
  winner_label: string;
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

function mapRpcRow(row: RpcRow): VoteResultsSummary | null {
  if (!isVotingMethod(row.voting_method)) return null;
  return {
    vote: {
      id: row.vote_id,
      public_id: row.public_id,
      title: row.title,
      voting_method: row.voting_method,
      locked_at: row.locked_at,
      password_protected: row.password_protected,
    },
    responseCount: row.response_count,
    winnerLabel: row.winner_label,
  };
}

export async function fetchVoteResultsSummary(
  publicId: string,
  password?: string,
): Promise<VoteResultsFetchResult> {
  const supabase = getSupabaseBrowser();
  if (!supabase) return { status: 'not_found' };

  const { data, error } = await supabase.rpc('get_vote_results_summary', {
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

  const summary = mapRpcRow(data as RpcRow);
  if (!summary) return { status: 'not_found' };
  return { status: 'ok', summary };
}
