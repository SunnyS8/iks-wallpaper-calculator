import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

/** Базовый путь для GitHub Pages: /имя-репозитория/ */
function githubPagesBase(): string {
  const raw = process.env.BASE_PATH?.trim();
  if (raw) {
    const withLeading = raw.startsWith('/') ? raw : `/${raw}`;
    return withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
  }
  // Fallback, если BASE_PATH не задан в CI
  return '/iks-wallpaper-calculator/';
}

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? githubPagesBase() : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
