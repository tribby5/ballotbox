import { getSupabaseBrowser } from '$lib/supabaseClient';
import type { VotingMethodValue } from '$lib/votingMethods';

export type CreateVoteInput = {
  public_id: string;
  title: string;
  optionLabels: string[];
  voting_method: VotingMethodValue;
  password: string;
};

export async function createVoteInSupabase(input: CreateVoteInput): Promise<void> {
  const supabase = getSupabaseBrowser();
  if (!supabase) throw new Error('Supabase is not configured');

  const trimmed = input.optionLabels.map((s) => s.trim()).filter(Boolean);
  if (trimmed.length < 2) throw new Error('At least two non-empty options are required');

  const { error } = await supabase.rpc('create_vote_with_options', {
    p_public_id: input.public_id.trim(),
    p_title: input.title.trim(),
    p_voting_method: input.voting_method,
    p_password: input.password.trim(),
    p_option_labels: trimmed,
  });

  if (error) throw error;
}
