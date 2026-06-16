import { describe, it, expect, afterEach, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/svelte';
import ResultsPage from './ResultsPage.svelte';

const sampleSummary = {
  vote: {
    id: '00000000-0000-0000-0000-000000000001',
    public_id: 'demo',
    title: 'Best pet',
    voting_method: 'ranked_pairs' as const,
    locked_at: '2026-01-01T00:00:00.000Z',
    password_protected: false,
  },
  responseCount: 1,
  winnerLabel: 'cat',
};

vi.mock('$lib/results/voteResultsRecord', () => ({
  fetchVoteResultsSummary: vi.fn(async () => ({ status: 'ok', summary: sampleSummary })),
}));

afterEach(() => {
  cleanup();
});

describe('ResultsPage', () => {
  it('renders winner block and detailed shell', async () => {
    render(ResultsPage, { props: { voteId: 'demo' } });
    expect(await screen.findByRole('heading', { level: 1, name: /best pet/i })).toBeInTheDocument();
    expect(screen.getByText(/1 vote received/i)).toBeInTheDocument();
    expect(screen.getByText(/^winner$/i)).toBeInTheDocument();
    expect(screen.getByText(/^cat$/i)).toBeInTheDocument();
    expect(screen.getByText(/using ranked pairs/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /detailed results/i })).toBeInTheDocument();
  });
});
