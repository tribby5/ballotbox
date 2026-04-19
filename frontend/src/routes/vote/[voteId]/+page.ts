import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { fetchVoteByPublicId } from '$lib/vote/voteRecord';

export const prerender = true;

export function entries() {
  return [{ voteId: 'demo' }, { voteId: 'c916qmc3' }, { voteId: 'jmezo271' }];
}

export const load: PageLoad = async ({ params }) => {
  const vote = await fetchVoteByPublicId(params.voteId);
  if (!vote) {
    error(404, 'Vote not found');
  }
  return { vote };
};
