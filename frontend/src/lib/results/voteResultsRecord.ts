import { fetchVoteByPublicId, type VoteRow } from '$lib/vote/voteRecord';

/** Summary row until Supabase exposes tallies + computed winner. */
export type VoteResultsSummary = {
  vote: VoteRow;
  responseCount: number;
  winnerLabel: string;
};

/** Stand-in for aggregating ballots + method outcome from Supabase. */
export async function fetchVoteResultsSummary(
  publicId: string,
): Promise<VoteResultsSummary | null> {
  const vote = await fetchVoteByPublicId(publicId);
  if (!vote) return null;
  return {
    vote,
    responseCount: 1,
    winnerLabel: vote.options[1] ?? vote.options[0] ?? '—',
  };
}
