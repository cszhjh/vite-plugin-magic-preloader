import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts({ include: ['lib'] })],
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      name: 'vite-plugin-magic-preloader',
      fileName: 'vite-plugin-magic-preloader',
    },
  },
});
