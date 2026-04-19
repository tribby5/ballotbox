import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => ({
  plugins: [sveltekit()],
  resolve:
    mode === 'test' || process.env.VITEST === 'true'
      ? { conditions: ['browser'] }
      : undefined,
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts']
  }
}));
