import { goto } from '$app/navigation';
import type { VoteRow } from '$lib/vote/voteRecord';
import { submitBallot } from '$lib/vote/submitBallot';
import { parseNumericRanks, type OptionRow } from './votePage.ranking';

export async function persistVoteBallot(
  vote: VoteRow,
  orderedOptionIds: string[],
): Promise<{ submitError: string | null; submittedProtected: boolean }> {
  if (vote.locked_at) {
    return { submitError: 'This vote is closed to new responses.', submittedProtected: false };
  }
  try {
    await submitBallot(vote.id, orderedOptionIds);
    if (vote.password_protected) {
      return { submitError: null, submittedProtected: true };
    }
    await goto(`/results/${encodeURIComponent(vote.public_id)}`);
    return { submitError: null, submittedProtected: false };
  } catch (e) {
    return {
      submitError: e instanceof Error ? e.message : 'Could not submit your vote.',
      submittedProtected: false,
    };
  }
}

export function submitDragOrder(ordered: OptionRow[]): string[] {
  return ordered.map((o) => o.id);
}

export function submitNumericOrder(
  numericRanks: string[],
  options: VoteRow['options'],
): { error: string } | { orderIds: string[] } {
  return parseNumericRanks(numericRanks, options);
}
