import { goto } from '$app/navigation';
import { createVoteInSupabase } from '$lib/vote/createVote';
import type { VotingMethodValue } from '$lib/votingMethods';

export function randomVoteId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export type CreateVoteInput = {
  voteId: string;
  title: string;
  options: string[];
  method: VotingMethodValue;
  password: string;
};

export async function finalizeCreateVote(input: CreateVoteInput): Promise<string | null> {
  const t = input.title.trim();
  if (!t) return 'Please enter a vote title.';

  const trimmedOpts = input.options.map((o) => o.trim()).filter(Boolean);
  if (trimmedOpts.length < 2) return 'Please enter at least two options.';

  const id = input.voteId.trim();
  if (!id) return 'Vote ID is not ready yet; try again.';

  try {
    await createVoteInSupabase({
      public_id: id,
      title: t,
      optionLabels: input.options,
      voting_method: input.method,
      password: input.password,
    });
    await goto(`/manage/${encodeURIComponent(id)}`);
    return null;
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Could not create the vote.';
    return /duplicate key|unique constraint/i.test(msg)
      ? 'That vote ID is already taken. Refresh to get a new one.'
      : msg;
  }
}
