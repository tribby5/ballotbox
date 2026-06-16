import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
  return { voteId: params.voteId };
};
