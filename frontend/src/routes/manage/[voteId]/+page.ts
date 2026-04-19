import type { PageLoad } from './$types';

export const prerender = true;

export function entries() {
  return [{ voteId: 'demo' }, { voteId: 'c916qmc3' }, { voteId: 'jmezo271' }];
}

export const load: PageLoad = ({ params }) => ({
  voteId: params.voteId,
});
