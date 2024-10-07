/// <reference types="vitest" />
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import ViteImagesPlugin from 'vite-plugin-vue-images';

export default defineConfig({
  plugins: [vue(), ViteImagesPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: 'src/components/DirectionalCarousel.vue',
      name: 'VueDirectionalCarousel',
    },
    rollupOptions: {
      external: ['vue', 'tests/**'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
    assetsInlineLimit: 4096
  },
});
