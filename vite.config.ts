import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base: process.env.VITE_BASE ?? '/',
  test: {
    environment: 'happy-dom',
    globals: true,
    include: [
      'src/**/__tests__/**/*.test.ts',
      'src/**/__tests__/**/*.test.js',
      'scripts/**/__tests__/**/*.test.ts',
      'scripts/**/__tests__/**/*.test.js',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'json-summary'],
      // Exclude non-code assets, generated data files, and the app entry point
      exclude: [
        '**/*.json',
        '**/*.svg',
        '**/main.ts',
        'src/data/**',
        'src/locales/**',
        'src/assets/**',
        '**/node_modules/**',
        '**/__tests__/**',
        '**/e2e/**',
      ],
      thresholds: {
        statements: 90,
        branches: 80,
        functions: 90,
        lines: 90,
      },
    },
  },
})
