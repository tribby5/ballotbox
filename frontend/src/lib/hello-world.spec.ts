import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import HelloWorld from './HelloWorld.svelte';

describe('HelloWorld', () => {
  it('renders hello world', () => {
    render(HelloWorld);
    expect(screen.getByRole('heading', { name: /hello world/i })).toBeInTheDocument();
  });
});
