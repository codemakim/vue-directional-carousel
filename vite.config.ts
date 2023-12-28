import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    lib: {
      entry: 'src/components/DirectionalCarousel.vue',
      name: 'VueDirectionalCarousel'
    },
    rollupOptions: {
      // 이곳에 추가적인 rollup 설정이 필요하다면 넣어줄 수 있습니다.
      external: ['vue'], // 외부 의존성으로 Vue를 사용한다면 여기에 추가
      output: {
        // UMD 빌드 설정
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
