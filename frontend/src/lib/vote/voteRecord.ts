import type { VotingMethodValue } from '$lib/votingMethods';

/**
 * Shape we expect to read from Supabase (table/columns TBD).
 * Replace `fetchVoteByPublicId` with a real query when the schema exists.
 */
export type VoteRow = {
  public_id: string;
  title: string;
  options: string[];
  voting_method: VotingMethodValue;
};

const STUB_VOTES: Record<string, VoteRow> = {
  demo: {
    public_id: 'demo',
    title: 'Best pet',
    options: ['dog', 'cat'],
    voting_method: 'ranked_pairs',
  },
  c916qmc3: {
    public_id: 'c916qmc3',
    title: 'Best pet',
    options: ['dog', 'cat'],
    voting_method: 'ranked_pairs',
  },
  jmezo271: {
    public_id: 'jmezo271',
    title: 'Create Vote',
    options: ['Option 1', 'Option 2'],
    voting_method: 'ranked_pairs',
  },
};

/** Stand-in for `supabase.from('votes').select(...).eq('public_id', id).single()` */
export async function fetchVoteByPublicId(publicId: string): Promise<VoteRow | null> {
  return STUB_VOTES[publicId] ?? null;
}
