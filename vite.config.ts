/**
 * Vite build and Vitest configuration.
 *
 * One file serves both so the unit tests compile through exactly the same plugins as the
 * production bundle; a separate test config would drift from what actually ships.
 */
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['src/test/setup.ts'],
  },
});
