/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  build: {
    // Never inline assets as data: URIs — the CSP (vercel.json) only allows fonts from 'self',
    // and Vite's default would embed the <4 KB font subsets straight into the CSS.
    assetsInlineLimit: 0,
    rollupOptions: isSsrBuild
      ? {} // the prerender build (entry-server.tsx) keeps node_modules external — nothing to chunk
      : {
          output: {
            // Framework code changes rarely: its own chunk stays cached across content deploys.
            manualChunks: { react: ['react', 'react-dom', 'react-router-dom'] },
          },
        },
  },
  test: {
    environment: 'node',
  },
}));
