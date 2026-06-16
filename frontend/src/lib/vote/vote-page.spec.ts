import { describe, it, expect, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/svelte';
import VotePage from './VotePage.svelte';

afterEach(() => {
  cleanup();
});

const sampleVote = {
  id: '00000000-0000-0000-0000-000000000001',
  public_id: 'demo',
  title: 'Best pet',
  voting_method: 'ranked_pairs' as const,
  locked_at: null,
  password_protected: false,
  options: [
    { id: 'opt-dog', label: 'dog', sort_order: 0 },
    { id: 'opt-cat', label: 'cat', sort_order: 1 },
  ],
};

describe('VotePage', () => {
  it('renders title, mode switch, and submit', () => {
    render(VotePage, { props: { vote: sampleVote } });
    expect(screen.getByRole('heading', { level: 1, name: /best pet/i })).toBeInTheDocument();
    expect(screen.getByText(/rank the options from most to least preferred/i)).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /drag & drop/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit vote/i })).toBeInTheDocument();
  });
});
