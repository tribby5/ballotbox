import { describe, it, expect, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/svelte';
import EducationPage from './EducationPage.svelte';

afterEach(() => {
  cleanup();
});

describe('EducationPage', () => {
  it('renders hero and comparison table', () => {
    render(EducationPage);
    expect(
      screen.getByRole('heading', { level: 1, name: /understanding voting methods/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /what is ranked-choice voting/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /method/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /further reading/i })).toBeInTheDocument();
  });
});
