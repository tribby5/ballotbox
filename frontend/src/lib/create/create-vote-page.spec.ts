import { describe, it, expect, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/svelte';
import CreateVotePage from './CreateVotePage.svelte';

afterEach(() => {
  cleanup();
});

describe('CreateVotePage', () => {
  it('renders create vote form', () => {
    render(CreateVotePage);
    expect(screen.getByRole('heading', { level: 1, name: /create vote/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/vote title/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /finalize vote/i })).toBeInTheDocument();
  });
});
