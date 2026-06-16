import { getSupabaseBrowser } from '$lib/supabaseClient';

/**
 * Persists a ballot atomically via `submit_ballot` RPC (ballot, rankings, and vote lock).
 * `orderedOptionIds` is most-preferred first (stored as rank 1 = best).
 */
export async function submitBallot(voteId: string, orderedOptionIds: string[]): Promise<void> {
  const supabase = getSupabaseBrowser();
  if (!supabase) throw new Error('Supabase is not configured');

  const { error } = await supabase.rpc('submit_ballot', {
    p_vote_id: voteId,
    p_option_ids: orderedOptionIds,
  });

  if (error) throw error;
}
