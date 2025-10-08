import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import magicPreloader from 'vite-plugin-magic-preloader'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    vueJsx(),
    magicPreloader({
      attrs: { as: 'script' },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    minify: false,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('src/utils/utils-')) {
            return 'utils'
          }

          if (id.includes('node_modules/lodash-es')) {
            return 'lodash'
          }
        },
      },
    },
  },
})
