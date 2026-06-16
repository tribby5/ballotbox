import { getSupabaseBrowser } from '$lib/supabaseClient';
import type { VotingMethodValue } from '$lib/votingMethods';

export type VoteOption = {
  id: string;
  label: string;
  sort_order: number;
};

export type VoteRow = {
  id: string;
  public_id: string;
  title: string;
  voting_method: VotingMethodValue;
  locked_at: string | null;
  password_protected: boolean;
  options: VoteOption[];
};

type VoteOptionsJoin = {
  id: string;
  sort_order: number;
  label: string;
};

type VoteDbRow = {
  id: string;
  public_id: string;
  title: string;
  voting_method: string;
  locked_at: string | null;
  password_protected: boolean;
  vote_options: VoteOptionsJoin[] | null;
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

function mapVoteRow(row: VoteDbRow): VoteRow | null {
  if (!isVotingMethod(row.voting_method)) return null;
  const raw = row.vote_options ?? [];
  const options = [...raw]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((o) => ({
      id: o.id,
      label: o.label,
      sort_order: o.sort_order,
    }));
  return {
    id: row.id,
    public_id: row.public_id,
    title: row.title,
    voting_method: row.voting_method,
    locked_at: row.locked_at,
    password_protected: row.password_protected,
    options,
  };
}

export async function fetchVoteByPublicId(publicId: string): Promise<VoteRow | null> {
  const supabase = getSupabaseBrowser();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('votes')
    .select(
      'id, public_id, title, voting_method, locked_at, password_protected, vote_options ( id, sort_order, label )',
    )
    .eq('public_id', publicId)
    .maybeSingle();

  if (error || !data) return null;
  return mapVoteRow(data as VoteDbRow);
}
