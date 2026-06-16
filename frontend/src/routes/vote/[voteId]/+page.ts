import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { fetchVoteByPublicId } from '$lib/vote/voteRecord';

export const load: PageLoad = async ({ params }) => {
  const vote = await fetchVoteByPublicId(params.voteId);
  if (!vote) {
    error(404, 'Vote not found');
  }
  return { vote };
};
