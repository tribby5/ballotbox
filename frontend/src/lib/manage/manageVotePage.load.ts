import { browser } from '$app/environment';
import { fetchVoteByPublicId } from '$lib/vote/voteRecord';
import { VOTING_METHODS } from '$lib/votingMethods';

export type ManageVoteView = {
  loaded: boolean;
  loadError: string | null;
  title: string;
  options: string[];
  methodLabel: string;
  hasResponses: boolean;
  passwordProtected: boolean;
};

export function manageVoteUrls(voteId: string): { shareUrl: string; resultsUrl: string } {
  if (browser) {
    return {
      shareUrl: `${window.location.origin}/vote/${encodeURIComponent(voteId)}`,
      resultsUrl: `${window.location.origin}/results/${encodeURIComponent(voteId)}`,
    };
  }
  return {
    shareUrl: `/vote/${encodeURIComponent(voteId)}`,
    resultsUrl: `/results/${encodeURIComponent(voteId)}`,
  };
}

export async function loadManageVote(voteId: string): Promise<ManageVoteView> {
  const row = await fetchVoteByPublicId(voteId);
  if (!row) {
    return {
      loaded: true,
      loadError: 'Vote not found, or Supabase is not configured.',
      title: '',
      options: [],
      methodLabel: '',
      hasResponses: false,
      passwordProtected: false,
    };
  }
  return {
    loaded: true,
    loadError: null,
    title: row.title,
    options: row.options.map((o) => o.label),
    methodLabel:
      VOTING_METHODS.find((m) => m.value === row.voting_method)?.label ?? row.voting_method,
    hasResponses: !!row.locked_at,
    passwordProtected: row.password_protected,
  };
}

export async function copyTextToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}
