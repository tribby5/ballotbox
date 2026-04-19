import { describe, it, expect, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/svelte';
import ResultsPage from './ResultsPage.svelte';

afterEach(() => {
  cleanup();
});

const sampleSummary = {
  vote: {
    public_id: 'demo',
    title: 'Best pet',
    options: ['dog', 'cat'],
    voting_method: 'ranked_pairs' as const,
  },
  responseCount: 1,
  winnerLabel: 'cat',
};

describe('ResultsPage', () => {
  it('renders winner block and detailed shell', () => {
    render(ResultsPage, { props: { summary: sampleSummary } });
    expect(screen.getByRole('heading', { level: 1, name: /best pet/i })).toBeInTheDocument();
    expect(screen.getByText(/1 vote received/i)).toBeInTheDocument();
    expect(screen.getByText(/^winner$/i)).toBeInTheDocument();
    expect(screen.getByText(/^cat$/i)).toBeInTheDocument();
    expect(screen.getByText(/using ranked pairs/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /detailed results/i })).toBeInTheDocument();
  });
});
