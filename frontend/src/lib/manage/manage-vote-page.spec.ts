import { describe, it, expect, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/svelte';
import ManageVotePage from './ManageVotePage.svelte';

afterEach(() => {
  cleanup();
});

describe('ManageVotePage', () => {
  it('renders manage UI with vote id and share section', () => {
    render(ManageVotePage, { props: { voteId: 'abc12xyz' } });
    expect(screen.getByText(/vote id:\s*abc12xyz/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /share vote link/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
  });
});
