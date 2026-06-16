import { describe, it, expect, afterEach, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/svelte';
import ManageVotePage from './ManageVotePage.svelte';

vi.mock('$lib/vote/voteRecord', () => ({
  fetchVoteByPublicId: vi.fn(async (publicId: string) => ({
    id: '00000000-0000-0000-0000-000000000099',
    public_id: publicId,
    title: 'Test vote',
    voting_method: 'ranked_pairs' as const,
    locked_at: null,
    password_protected: false,
    options: [
      { id: 'o1', label: 'One', sort_order: 0 },
      { id: 'o2', label: 'Two', sort_order: 1 },
    ],
  })),
}));

afterEach(() => {
  cleanup();
});

describe('ManageVotePage', () => {
  it('renders read-only manage UI with vote id and share section', async () => {
    render(ManageVotePage, { props: { voteId: 'abc12xyz' } });
    expect(screen.getByText(/vote id:\s*abc12xyz/i)).toBeInTheDocument();
    expect(await screen.findByRole('heading', { level: 1, name: /test vote/i })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: /share vote link/i })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: /copy/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /save changes/i })).not.toBeInTheDocument();
  });
});
