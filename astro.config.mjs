import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://el-j.github.io',
  base: '/',
  output: 'static',
  vite: {
    server: {
      host: true,
      port: 4321,
    },
  },
})
