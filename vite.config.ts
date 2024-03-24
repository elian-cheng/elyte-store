/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    css: true,
    coverage: {
      include: ['src/**/*'],
      exclude: [
        'src/const/*',
        'src/main.tsx',
        '**/*/@(index|config).@(tsx|ts)',
        '**/*/*.@(icon|asset).@(tsx|ts)',
      ],
      enabled: true,
      provider: 'istanbul',
      reporter: ['text'],
      all: true,
    },
  },
});
