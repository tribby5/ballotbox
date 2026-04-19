import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { fetchVoteResultsSummary } from '$lib/results/voteResultsRecord';

export const prerender = true;

export function entries() {
  return [{ voteId: 'demo' }, { voteId: 'c916qmc3' }, { voteId: 'jmezo271' }];
}

export const load: PageLoad = async ({ params }) => {
  const summary = await fetchVoteResultsSummary(params.voteId);
  if (!summary) {
    error(404, 'Vote not found');
  }
  return { summary };
};
