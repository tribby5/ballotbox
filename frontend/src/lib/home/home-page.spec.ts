import { describe, it, expect, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/svelte';
import { fireEvent } from '@testing-library/dom';
import { tick } from 'svelte';
import HomePage from './HomePage.svelte';

afterEach(() => {
  cleanup();
});

describe('HomePage', () => {
  it('renders hero and primary actions', () => {
    render(HomePage);
    expect(screen.getByRole('heading', { level: 1, name: /ballot box/i })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /create new vote set up a new vote with custom options/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^voting methods$/i })).toBeInTheDocument();
  });

  it('enables join when vote code is entered', async () => {
    render(HomePage);
    const join = screen.getByRole('button', { name: /^join$/i });
    expect(join).toBeDisabled();
    const input = screen.getByLabelText(/vote code to join/i);
    fireEvent.input(input, { target: { value: 'abc123' } });
    await tick();
    expect(join).toBeEnabled();
  });
});
