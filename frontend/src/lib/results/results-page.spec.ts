import { describe, it, expect, afterEach, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/svelte';
import ResultsPage from './ResultsPage.svelte';
import type { ResultsComputation } from './tabulation';

const computation: ResultsComputation = {
  method: 'ranked_pairs',
  winnerIds: ['cat'],
  ranking: [
    { optionId: 'cat', label: 'cat', rank: 1, tied: false },
    { optionId: 'dog', label: 'dog', rank: 2, tied: false },
  ],
  chart: {
    title: 'Head-to-head wins',
    unit: 'wins',
    bars: [
      { optionId: 'cat', label: 'cat', value: 1, isWinner: true },
      { optionId: 'dog', label: 'dog', value: 0, isWinner: false },
    ],
  },
  steps: [{ heading: 'Winner', detail: 'cat sits at the top of the locked ranking.' }],
  pairwise: {
    options: [
      { id: 'cat', label: 'cat' },
      { id: 'dog', label: 'dog' },
    ],
    matrix: [
      [0, 1],
      [0, 0],
    ],
  },
};

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
  winnerLabels: ['cat'],
  computation,
};

vi.mock('$lib/results/voteResultsRecord', () => ({
  fetchVoteResultsSummary: vi.fn(async () => ({ status: 'ok', summary: sampleSummary })),
}));

afterEach(() => {
  cleanup();
});

describe('ResultsPage', () => {
  it('renders winner block and detailed breakdown', async () => {
    render(ResultsPage, { props: { voteId: 'demo' } });
    expect(await screen.findByRole('heading', { level: 1, name: /best pet/i })).toBeInTheDocument();
    expect(screen.getByText(/1 vote received/i)).toBeInTheDocument();
    expect(screen.getByText(/^winner$/i, { selector: '.winner-kicker' })).toBeInTheDocument();
    expect(screen.getByText(/^cat$/i, { selector: '.winner-name' })).toBeInTheDocument();
    expect(screen.getByText(/using ranked pairs/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /detailed results/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /final ranking/i })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: /how the winner was decided/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /head-to-head matchups/i })).toBeInTheDocument();
  });
});
